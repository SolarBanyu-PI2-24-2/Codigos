import environ
import requests
import ssl
import paho.mqtt.client as paho
import paho.mqtt.subscribe as subscribe
import json

from paho import mqtt
from pathlib import Path

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

def on_message(client, userdata, msg):
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
                
                if response.status_code == 201:
                    print(f"Dado enviado com sucesso.")
                else:
                    print(f"Falha ao enviar dados: {response.status_code} - {response.text}")
        else:
            print(f"Sensor {sensor_type} não encontrado.")

def start_mqtt():
    global sensors
    response = requests.get(f"{API_HOST}/sensores/")
    sensors = response.json()
    
    print(f"Sensores: {sensors}")
    
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