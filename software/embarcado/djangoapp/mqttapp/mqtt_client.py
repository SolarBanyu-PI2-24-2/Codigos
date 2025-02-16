import environ
import requests
import ssl
import paho.mqtt.client as paho
import paho.mqtt.subscribe as subscribe
import json

from paho import mqtt
from pathlib import Path
from time import sleep
from django.utils.timezone import now

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR.parent / 'data' / 'web'

env = environ.Env()
ENV_FILE = BASE_DIR / ".env"
env.read_env(ENV_FILE)

BROKER_HOST = env('BROKER_HOST')
BROKER_PORT = env.int('BROKER_PORT')
BROKER_USERNAME = env('BROKER_USERNAME')
BROKER_PASSWORD = env('BROKER_PASSWORD')
SENSORS_VALUES_TOPIC = env('BROKER_SENSOR_TOPIC')

API_HOST = env('API_HOST')

sensors = []

unidades = {
    "TEMPERATURA_AGUA": "°C",
    "PH_AGUA": "pH",
    "NIVEL_AGUA": "cm",
    "TENSAO": "V",
    "FLUXO_AGUA": "L/min"
}

mqtt_logs = []

def on_message(client, userdata, msg):
    global mqtt_logs
    
    print(f"Mensagem recebida no tópico {msg.topic}: {msg.payload.decode()}")
    
    sensors_data_updated = json.loads(msg.payload.decode())
    
    headers = {"Content-Type": "application/json"}

    for sensor_data in sensors_data_updated:
        sensor_type = sensor_data["tipo"]
        sensor_value = sensor_data["valor"]
        sensor_value_unit = unidades[sensor_type]
        
        sensor = next((item for item in sensors if item["tipo"] == sensor_type), None)
        
        if sensor is not None:
            req_json = {
                "valor": round(sensor_value, 2),
                "unidade": sensor_value_unit,
                "sensor_id": sensor["id"]
            }

            if sensor is not None:
                print(f"Enviando: {req_json}")
                response = requests.post(f"{API_HOST}/dados_sensores/", headers=headers, json=req_json)
                
                if sensor_value is None or sensor_value <= 0:
                    print(f"Valor zero detectado no {sensor['tipo']}")
                    requests.post(f"{API_HOST}/alertas/", headers=headers, json={
                        "tipo": sensor["tipo"],
                        "descricao": f"Valor zero no {sensor['tipo']}",
                        "prioridade": "Média",
                        "dispositivo_id": sensor["dispositivo_id"],
                    })
                    
                if (sensor_value) > 50 and sensor['tipo'] == "TEMPERATURA_AGUA":
                    requests.post(f"{API_HOST}/alertas/", headers=headers, json={
                        "tipo": sensor["tipo"],
                        "descricao": f"Temperatura está muito alta: {sensor_value} oC",
                        "prioridade": "Média",
                        "dispositivo_id": sensor["dispositivo_id"],
                    })
                    
                if (sensor_value < 5 or sensor_value > 8) and sensor['tipo'] == "PH_AGUA":
                    requests.post(f"{API_HOST}/alertas/", headers=headers, json={
                        "tipo": sensor["tipo"],
                        "descricao": f"Ph está fora do intervalo de 6 a 8: {sensor_value} oC",
                        "prioridade": "Baixa",
                        "dispositivo_id": sensor["dispositivo_id"],
                    })
                
                if response.status_code == 201:
                    print(f"Dado enviado com sucesso.")
                    if len(mqtt_logs) > 30:
                        mqtt_logs.clear()
                    
                    mqtt_logs.append({
                        'timestamp': now(),  # Timestamp da mensagem MQTT
                        'message': req_json  # Conteúdo da mensagem
                    })
                else:
                    print(f"Falha ao enviar dados: {response.status_code} - {response.text}")
                    requests.post(f"{API_HOST}/alertas/", headers=headers, json={
                        "tipo": sensor['tipo'],
                        "descricao": f"Falha no envio de dados {sensor['tipo']}",
                        "prioridade": "Crítica",
                        "dispositivo_id": sensor["dispositivo_id"],
                    })
                    
            
        else:
            print(f"Sensor {sensor_type} não encontrado.")

def start_mqtt():
    global sensors
    
    try:
        response = requests.get(f"{API_HOST}/sensores/")
        sensors = response.json()
        
        print(f"Sensores: {sensors}")
    except requests.exceptions.RequestException as e:
        print(f"Falha ao conectar com o API. Tentando novamente...")
        sleep(1)
        return start_mqtt()
    
    sslSettings = ssl.SSLContext(mqtt.client.ssl.PROTOCOL_TLS)
    auth = {
        'username': BROKER_USERNAME, 
        'password': BROKER_PASSWORD,
    }

    subscribe.callback(on_message, 
                SENSORS_VALUES_TOPIC, 
                hostname=BROKER_HOST, 
                port=BROKER_PORT, 
                auth=auth,
                tls=sslSettings, 
                protocol=paho.MQTTv31)