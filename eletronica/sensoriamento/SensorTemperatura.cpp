#include <OneWire.h>
#include <DallasTemperature.h>

const int PINO_ONEWIRE = 25; // Define o pino do sensor
OneWire oneWire(PINO_ONEWIRE); // Cria um objeto OneWire
DallasTemperature sensor(&oneWire); // Informa a referência da biblioteca DallasTemperature para o OneWire
DeviceAddress endereco_temp; // Armazena o endereço do sensor no barramento

const int BUFFER_SIZE = 10; // Tamanho do buffer (10 leituras para 5 segundos a 0,5s cada)
float buffer[BUFFER_SIZE]; // Array para armazenar as leituras
int bufferIndex = 0; // Índice atual do buffer

unsigned long lastMeasurementTime = 0; // Armazena o tempo da última leitura
unsigned long lastDisplayTime = 0; // Armazena o tempo da última exibição
const unsigned long MEASUREMENT_INTERVAL = 500; // Intervalo entre leituras (0,5s)
const unsigned long DISPLAY_INTERVAL = 5000; // Intervalo entre exibições (5s)

void setup() {
  Serial.begin(115200); // Inicia a comunicação serial
  Serial.println("Iniciando medição de temperatura..."); // Mensagem inicial
  sensor.begin(); // Inicia o sensor
  if (!sensor.getAddress(endereco_temp, 0)) {
    Serial.println("Nenhum sensor detectado! Verifique a conexão.");
  } else {
    Serial.println("Sensor detectado com sucesso!");
  }

  // Inicializa o buffer com zeros
  for (int i = 0; i < BUFFER_SIZE; i++) {
    buffer[i] = 0.0;
  }
}

void loop() {
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
    float media = soma / BUFFER_SIZE;

    // Exibe a média no monitor serial
    Serial.print("Média das últimas 10 leituras (5s) = ");
    Serial.print(media, 1);
    Serial.println(" °C");
  }
}
