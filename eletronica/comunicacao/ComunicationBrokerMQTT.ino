#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#include "secrets.h";

const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;

const char* mqtt_broker = MQTT_BROKER;
const int mqtt_port = MQTT_PORT;
const char* mqtt_username = MQTT_USERNAME;
const char* mqtt_password = MQTT_PASSWORD;
const int mqtt_pub_interval = PUB_EACH_10_SEC;

const char* topic_publish_sensors_values = MQTT_PUBLISH_TOPIC;

WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

long previous_time = 0;

void setupMQTT() {
  mqttClient.setServer(mqtt_broker, mqtt_port);
}

void reconnect() {
  Serial.println("Connecting to MQTT Broker. Please, wait...");
  
  while (!mqttClient.connected()) {
    Serial.println("Reconnecting to MQTT Broker...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (mqttClient.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Connected to MQTT Broker.");
    } else {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Connected to Wi-Fi");

  wifiClient.setInsecure();
  
  setupMQTT();
}

void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }

  mqttClient.loop();

  long now = millis();

  // Publish every PUB_EARCH_SEC seconds
  if ((now - previous_time) > mqtt_pub_interval) {
    previous_time = now;

    struct Sensor {
      const char* tipo;
      float valor;
    };

    Sensor sensores[] = {
      {"TEMPERATURA_AGUA", 22.5},
      {"PH_AGUA", 15.7},
      {"NIVEL_AGUA", 43.7},
      {"TENSAO", 25.7},
      {"FLUXO_AGUA", 11.3}
    };

    // Criar JSON
    StaticJsonDocument<256> sensorValuesJson;
    JsonArray array = sensorValuesJson.to<JsonArray>();

    for (const auto& sensor : sensores) {
      JsonObject obj = array.createNestedObject();
      obj["tipo"] = sensor.tipo;
      obj["valor"] = sensor.valor;
    }

    char jsonBuffer[256];
    serializeJson(sensorValuesJson, jsonBuffer);
    
    // Publish json to the MQTT topic
    int sendStatus = mqttClient.publish(topic_publish_sensors_values, jsonBuffer);
    
    if (sendStatus) {
      Serial.println("JSON enviado com sucesso!");
      Serial.println(jsonBuffer);
    } else {
      Serial.println("Falha ao enviar o JSON!");
    }
  }
}