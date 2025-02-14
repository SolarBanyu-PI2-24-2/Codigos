from django.apps import AppConfig
from .mqtt_client import start_mqtt

class MqttappConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "mqttapp"

    def ready(self):
        # Iniciar o cliente MQTT quando o servidor Django iniciar
        start_mqtt()