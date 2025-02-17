#include <OneWire.h>
#include <DallasTemperature.h>

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#include "secrets.h"

// -------------------------------------------------------------------------
//CONFIGURAÇÃO GPIOS
int pHSense          = 36; // Gpio 36 ADC1
const int PINO_ONEWIRE = 33; // Define o pino do sensor de temperatura
const int pinSensor_nivel = 27;  // Pino digital conectado ao sensor de nivel
int pintensao = 32; // pino analogico para sensor tensao
const int RelePin = 13; // pino do rele OLHAR NA PLACA ANTES!!!!!!
const int pinovazao = 25; // Pino digital para o sensor

// Sensor ph

int samples_ph          = 20; // Número de amostras para média
float adc_resolution_ph = 4095.0; // Resolução ADC do ESP32-C6 (12 bits)
float vRef_ph           = 3.3; // Tensão de referência do ADC do ESP32-C6



// valores para o sensor de vazao
int pulsos;
float fluxoLitrosPorMinuto = 0.0; // Taxa de fluxo em L/min
float volumeTotal = 0.0; // Volume total em litros
unsigned long tempoAnterior = 0; // Armazena o tempo da última atualização
const float fatorCalibracao=4.78; // Fator de calibração do sensor de acordo com a sua alimentação
OneWire oneWire(PINO_ONEWIRE); // Cria um objeto OneWire
DallasTemperature sensor(&oneWire); // Informa a referência da biblioteca DallasTemperature para o OneWire
DeviceAddress endereco_temp; // Armazena o endereço do sensor no barramento
const int BUFFER_SIZE = 10; // Tamanho do buffer (10 leituras para 5 segundos a 0,5s cada)
float buffer[BUFFER_SIZE]; // Array para armazenar as leituras
int bufferIndex = 0; // Índice atual do buffer


///variaveis para temperatura
unsigned long lastMeasurementTime = 0; // Armazena o tempo da última leitura
unsigned long lastDisplayTime = 0; // Armazena o tempo da última exibição
const unsigned long MEASUREMENT_INTERVAL = 500; // Intervalo entre leituras (0,5s)
const unsigned long DISPLAY_INTERVAL = 5000; // Intervalo entre exibições (5s)
// -------------------------------------------------------------------------
// CONFIGURAÇÃO MQTT E WIFI
long previous_time = 0;                         // Utilizado para calcular o tempo de envio dos dados via MQTT

const char *ssid = WIFI_SSID;                   // Nome da rede wi-fi
const char *password = WIFI_PASSWORD;           // Senha da rede wi-fi

const char *mqtt_broker = MQTT_BROKER;          // Url do broker MQTT (HiveQM)
const int mqtt_port = MQTT_PORT;                // Porta do broker
const char *mqtt_username = MQTT_USERNAME;      // Nome de usuario do broker
const char *mqtt_password = MQTT_PASSWORD;      // Senha do usuário do broker
const int mqtt_pub_interval = PUB_EACH_10_SEC;  // Intervalo de envio dos dados

const char *topic_publish_sensors_values = MQTT_PUBLISH_TOPIC;  // Topico para publicar os dados dos sensores


WiFiClientSecure wifiClient;                    // Instancia de controle das funcoes do wi-fi
PubSubClient mqttClient(wifiClient);            // Instancia de controle das funcoes do mqtt

// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// FUNÇAO SENSOR DE PH

float ph(float voltage_ph) {
  return 7 + ((2.5 - voltage_ph) / 0.18);
}


// -------------------------------------------------------------------------
// FUNÇÃO SENSOR DE TEMPERATURA
float Leitura_temperatura(){
  float temp;
unsigned long currentTime = millis();
  // Realiza uma leitura a cada 0,5 segundos
  if (currentTime - lastMeasurementTime >= MEASUREMENT_INTERVAL) {
    lastMeasurementTime = currentTime;

    sensor.requestTemperatures(); // Envia comando para realizar a conversão de temperatura
    float temperatura = sensor.getTempC(endereco_temp); // Obtém a temperatura em Celsius

    if (temperatura != DEVICE_DISCONNECTED_C) { // Verifica se a leitura é válida
      // Adiciona a nova leitura ao buffer
      buffer[bufferIndex] = temperatura;
      bufferIndex = (bufferIndex + 1) % BUFFER_SIZE; // Atualiza o índice (com wrap-around)
    }
  }

  // Exibe a média a cada 5 segundos
  if (currentTime - lastDisplayTime >= DISPLAY_INTERVAL) {
    lastDisplayTime = currentTime;

    // Calcula a média do buffer
    float soma = 0.0;
    for (int i = 0; i < BUFFER_SIZE; i++) {
      soma += buffer[i];
    }
    temp = soma / BUFFER_SIZE;

  //Serial.begin(115200); // Inicia a comunicação serial
  //Serial.println("Iniciando medição de temperatura..."); // Mensagem inicial
  sensor.begin(); // Inicia o sensor
  if (!sensor.getAddress(endereco_temp, 0)) {

return temp;
  }
}}
// --------------------------------------------------------------------------------------------------------
//FUNÇÃO SENSOR DE TENSÃO
float sensor_tensao(){

//constantes
const float tensaoReferencia = 3.4;

// Resolução do ADC da ESP32
const int resolucaoADC = 4095;

// Fator de escala do divisor de tensão
// R1 = 30kΩ e R2 = 7.5kΩ
const float fatorDivisor = (30.0 + 7.5) / 7.5; // 5

const int numLeituras = 10;
float leituras[numLeituras] = {0};
int indiceLeitura = 0;


// Lê o valor analógico do pino
  int valorAnalogico = analogRead(pintensao);

  // Converte o valor lido para tensão no divisor
  float tensaoSensor = (valorAnalogico / float(resolucaoADC)) * tensaoReferencia;

  // Calcula a tensão real antes do divisor
  float tensaoReal = tensaoSensor * fatorDivisor;

  // Armazena a leitura no array circular
  leituras[indiceLeitura] = tensaoReal;
  indiceLeitura = (indiceLeitura + 1) % numLeituras;

  // Calcula a média das últimas 10 leituras
  float soma = 0;
  for (int i = 0; i < numLeituras; i++) {
    soma += leituras[i];
  }
  float mediaTensao = soma / numLeituras;
return tensaoReal;
}
// --------------------------------------------------------------------------------------------------------

//FUNÇÃO SENSOR DE VAZÃO

void IRAM_ATTR contarPulsos() {
  pulsos++; // Incrementa a contagem de pulsos
}


// --------------------------------------------------------------------------------------------------------
// Função que tenta conectar novamente caso a conexão com o MQTT caia.
void reconnect()
{
  Serial.println("Connecting to MQTT Broker. Please, wait...");

  while (!mqttClient.connected())
  {
    Serial.println("Reconnecting to MQTT Broker...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);

    if (mqttClient.connect(clientId.c_str(), mqtt_username, mqtt_password))
    {
      Serial.println("Connected to MQTT Broker.");
    }
    else
    {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setupMQTT()
{
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Connected to Wi-Fi");

  wifiClient.setInsecure();

  mqttClient.setServer(mqtt_broker, mqtt_port);
}

// --------------------------------------------------------------------------------------------------------


void setup() {
  Serial.begin(115200); // Inicia a comunicação serial

  // Configura o pino do sensor de nivel como entrada
  pinMode(pinSensor_nivel, INPUT);
  // Configure o pino DO RELE como saída
  pinMode(RelePin, OUTPUT);
  // Configura o pino do sensor como entrada
  pinMode(pinovazao, INPUT); 
  attachInterrupt(digitalPinToInterrupt(pinovazao), contarPulsos, RISING); // Configura interrupção para contar pulsos

sensor_tensao();
Leitura_temperatura();
// Configuracao do broker MQTT
setupMQTT();

}

void loop() {

/// Calculo para o sensor de ph

int measurings_ph = 0;
  
  // Coleta de múltiplas leituras para maior precisão
  for (int i = 0; i < samples_ph; i++) {
    int from_ad = analogRead(pHSense);
    measurings_ph += from_ad;
    delay(10);
    //Serial.print("ADC Raw Value: ");
    //Serial.println(from_ad);
  }
  
  // Cálculo da média e conversão para tensão
  float averageAdc = measurings_ph / (float)samples_ph;
  float voltage_ph = (averageAdc / adc_resolution_ph) * vRef_ph;



//variaveis a serem lidas e enviadas

float real_temp;
bool real_state_nivel;
float real_voltage;
float fluxo=0;
float volume=0;

    //digitalWrite(RelePin, LOW); //bomba ligada


if (digitalRead(pinSensor_nivel) == HIGH ){
  digitalWrite(RelePin, LOW); //bomba ligada
  Serial.println("Bomba desligada");

}
else{
    digitalWrite(RelePin, HIGH); //bomba ligada
    Serial.println("Bomba ligada");
}

unsigned long tempoAtual = millis(); // Tempo atual em milissegundos
unsigned long intervalo = tempoAtual - tempoAnterior; // Calcula o intervalo de tempo

if (intervalo >= 1000) { // Atualiza a cada 500 ms
    tempoAnterior = tempoAtual; // Atualiza o tempo anterior
    fluxo = (pulsos / fatorCalibracao); // Calcula a taxa de fluxo
    volume += (fluxo / 15); // Calcula o volume total
}
// codigo novo



//leitura dos sensores <-------------------->
Serial.print("-----------Valores Sensores------------------\n");
Serial.print("Temperatura: ");
Serial.println(Leitura_temperatura(), 2);
Serial.print("PH: ");
Serial.println(ph(voltage_ph), 2);
Serial.print("Fluxo: ");
Serial.println(fluxo, 2);
Serial.print("Volume: ");
Serial.println(volume, 2);
Serial.print("Tensao: ");
Serial.println(sensor_tensao(), 2);
Serial.print("---------------------------------------\n");

 // Envio dos dados via MQTT
  if (!mqttClient.connected())
  {
    reconnect();
  }

  mqttClient.loop();

  long now = millis();

  // Publica mensagens a cada PUB_EARCH_SEC segundos
  if ((now - previous_time) > mqtt_pub_interval)
  {
    previous_time = now;

    struct Sensor
    {
      const char *tipo;
      float valor;
    };

    Sensor sensores[] = {
        {"TEMPERATURA_AGUA", Leitura_temperatura()},
        {"PH_AGUA", ph(voltage_ph)},
        {"NIVEL_AGUA", digitalRead(pinSensor_nivel)},
        {"TENSAO", sensor_tensao()},
        {"FLUXO_AGUA", volume}};

    // Cria o JSON
    StaticJsonDocument<256> sensorValuesJson;
    JsonArray array = sensorValuesJson.to<JsonArray>();

    for (const auto &sensor : sensores)
    {
      JsonObject obj = array.createNestedObject();
      obj["tipo"] = sensor.tipo;
      obj["valor"] = sensor.valor;
    }

    char jsonBuffer[256];
    serializeJson(sensorValuesJson, jsonBuffer);

    // Publica o json em um topico MQTT
    int sendStatus = mqttClient.publish(topic_publish_sensors_values, jsonBuffer);

    if (sendStatus)
    {
      Serial.println("JSON enviado com sucesso!");
      Serial.println(jsonBuffer);
    }
    else
    {
      Serial.println("Falha ao enviar o JSON!");
    }
  }
  }

