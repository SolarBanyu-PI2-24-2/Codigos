import paho.mqtt.client as mqtt
import environ

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR.parent / 'data' / 'web'

env = environ.Env()
ENV_FILE = BASE_DIR / ".env"
env.read_env(ENV_FILE)

BROKER_HOST = env('BROKER_HOST')
BROKER_PORT = env.int('BROKER_PORT')
TOPICS = env('BROKER_TOPICS').split(',')

# Callback executado quando a conexão com o broker é estabelecida
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado ao broker MQTT com sucesso!")
        
        for topic in TOPICS:
            client.subscribe(str(topic))
        
        print(f"Inscrito nos tópicos: {TOPICS}")
    else:
        print(f"Erro ao conectar ao broker. Código: {rc}")

# Callback executado quando uma mensagem é recebida
def on_message(client, userdata, msg):
    # TODO: send to backend
    print(f"Mensagem recebida no tópico {msg.topic}: {msg.payload.decode()}")

# Inicializa e configura o cliente MQTT
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

def start_mqtt():
    mqtt_client.connect(BROKER_HOST, BROKER_PORT)
    mqtt_client.loop_start()