from django.apps import AppConfig
from .mqtt_client import start_mqtt
from time import sleep
import os

import threading

class MqttappConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "mqttapp"

    def ready(self):
        # Iniciar o cliente MQTT quando o servidor Django iniciar
        if os.environ.get("RUN_MAIN") == "true":
            threadMqtt = threading.Thread(target=start_mqtt)
            threadMqtt.start()
