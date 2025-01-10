import paho.mqtt.client as mqtt

BROKER = "test.mosquitto.org"
PORT = 1883  # Porta MQTT padrão
TOPIC = "test/mqtt/django"

# Callback executado quando a conexão com o broker é estabelecida
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado ao broker MQTT com sucesso!")
        client.subscribe(TOPIC)
        print(f"Inscrito no tópico: {TOPIC}")
    else:
        print(f"Erro ao conectar ao broker. Código: {rc}")

# Callback executado quando uma mensagem é recebida
def on_message(client, userdata, msg):
    print(f"Mensagem recebida no tópico {msg.topic}: {msg.payload.decode()}")

# Inicializa e configura o cliente MQTT
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

def start_mqtt():
    mqtt_client.connect(BROKER, PORT)
    mqtt_client.loop_start()  # Mantém o cliente rodando em segundo plano