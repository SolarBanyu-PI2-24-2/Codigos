import paho.mqtt.client as mqtt
import environ
import requests

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR.parent / 'data' / 'web'

env = environ.Env()
ENV_FILE = BASE_DIR / ".env"
env.read_env(ENV_FILE)

BROKER_HOST = env('BROKER_HOST')
BROKER_PORT = env.int('BROKER_PORT')
TOPIC = env('BROKER_TOPIC')
API_HOST = env('API_HOST')

sensors = []

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado ao broker MQTT com sucesso!")
        client.subscribe(str(TOPIC))
        print(f"Inscrito no tópico: {TOPIC}")
    else:
        print(f"Erro ao conectar ao broker. Código: {rc}")

def on_message(client, userdata, msg):
    print(f"Mensagem recebida no tópico {msg.topic}: {msg.payload.decode()}")
    
    #TODO: pegar o tipo de sensor pelo payload da mensagem e filtrar o sensor
    
    headers = {"Content-Type": "application/json"}
    dados = {
        "valor": 12.43,
        "unidade": "L",
        "sensor_id": "0f9fc644-532c-48e1-b09e-54667e54eac9"
    }

    response = requests.post(f"{API_HOST}/dados_sensores/", headers=headers, json=dados)
    print("Status Code:", response.status_code)

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

def start_mqtt():
    global sensors
    response = requests.get(f"{API_HOST}/sensores/")
    sensors = response.json()
    
    print(f"Sensores: {sensors}")
    
    mqtt_client.connect(BROKER_HOST, BROKER_PORT)
    mqtt_client.loop_start()