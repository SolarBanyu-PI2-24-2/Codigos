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

    // Sensor values
    const char* type1 = "temperatura";
    float value1 = 22.5;
    const char* unit1 = "°C";

    const char* type2 = "umidade";
    float value2 = 45.7;
    const char* unit2 = "%";

    // Json builder
    StaticJsonDocument<256> sensorValuesJson;

    // Temp sensor
    JsonArray array = sensorValuesJson.to<JsonArray>();
    JsonObject obj1 = array.createNestedObject();
    obj1["tipo"] = type1;
    obj1["valor"] = value1;
    obj1["unidade"] = unit1;

    // Humidity sensor
    JsonObject obj2 = array.createNestedObject();
    obj2["tipo"] = type2;
    obj2["valor"] = value2;
    obj2["unidade"] = unit2;

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