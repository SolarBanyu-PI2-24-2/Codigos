#include <OneWire.h>
#include <DallasTemperature.h>





// -------------------------------------------------------------------------
//CONFIGURAÇÃO GPIOS
int pHSense          = 36; // Gpio 36 ADC1
const int PINO_ONEWIRE = 33; // Define o pino do sensor de temperatura
const int pinSensor_nivel = 27;  // Pino digital conectado ao sensor de nivel
int pintensao = 32; // pino analogico para sensor tensao
const int RelePin = 13; // pino do rele OLHAR NA PLACA ANTES!!!!!!
const int pinovazao = 25; // Pino digital para o sensor
// valores para o sensor de vazao
int pulsos;
float fluxoLitrosPorMinuto = 0.0; // Taxa de fluxo em L/min
float volumeTotal = 0.0; // Volume total em litros
unsigned long tempoAnterior = 0; // Armazena o tempo da última atualização
const float fatorCalibracao = 4.78; // Fator de calibração do sensor de acordo com a sua alimentação
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



// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// FUNÇAO SENSOR DE PH
float Leitura_PH(float saida_ph){
//variaveis para a leitura
int samples          = 20; // Número de amostras para média
float adc_resolution = 4095.0; // Resolução ADC do ESP32-C6 (12 bits)
float vRef           = 3.3; // Tensão de referência do ADC do ESP32-C6
int measurings       = 0;
  

  // Coleta de múltiplas leituras para maior precisão
  for (int i = 0; i < samples; i++) {
    int from_ad = analogRead(pHSense);
    measurings += from_ad;
    delay(10);
    //Serial.print("ADC Raw Value: ");
    //Serial.println(from_ad);
  }




  // Cálculo da média e conversão para tensão
  float averageAdc = measurings / (float)samples;
  float voltage = (averageAdc / adc_resolution) * vRef;

  saida_ph = 7 + ((2.5 - voltage) / 0.18);

return saida_ph;

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
  Serial.println("Iniciando medição de temperatura..."); // Mensagem inicial
  sensor.begin(); // Inicia o sensor
  if (!sensor.getAddress(endereco_temp, 0)) {
    Serial.println("Nenhum sensor detectado! Verifique a conexão.");
  } else {
    Serial.println("Sensor detectado com sucesso!");
  }

return temp;
  }
// --------------------------------------------------------------------------------------------------------

}


// --------------------------------------------------------------------------------------------------------
//Função sensor de nivel
/*bool sensor_nivel(){
  bool estado_sensor;

  int Sensor = digitalRead(pinSensor);

  // Verifica o estado do sensor e exibe no monitor serial
  if (Sensor == LOW) {
    Serial.println("Nível de água baixo");
    estado_sensor == false;
  } else {
    Serial.println("Nível de água alto");
    estado_sensor == true;
  }
  return estado_sensor;

}*/
// --------------------------------------------------------------------------------------------------------
//FUNÇÃO SENSOR DE TENSÃO
float sensor_tensao(){
  // Tensão de referência do ADC da ESP32 (3.3V)
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
  float mediaTensao = 10*soma / numLeituras;
  return mediaTensao;
}

// --------------------------------------------------------------------------------------------------------

//FUNÇÃO SENSOR DE VAZÃO

void IRAM_ATTR contarPulsos() {
  pulsos++; // Incrementa a contagem de pulsos
}
/*float sensor_vazao(){
float fluxo;
float Vol_total;
const float fatorCalibracao = 4.78; // Fator de calibração do sensor de acordo com a sua alimentação
unsigned long tempoAtual = millis(); // Tempo atual em milissegundos
unsigned long tempoAnterior = 0; // Armazena o tempo da última atualização
unsigned long intervalo = tempoAtual - tempoAnterior; // Calcula o intervalo de tempo

  if (intervalo >= 500) { // Atualiza a cada 500 ms
    tempoAnterior = tempoAtual; // Atualiza o tempo anterior
    fluxo = (pulsos / fatorCalibracao); // Calcula a taxa de fluxo
    Vol_total += (fluxo / 110.0); // Calcula o volume total
  }


Serial.print("Fluxo dentro da funcao:\n ");
Serial.println(fluxo, 2);
//Serial.print("Volume dentro da funcao:\n ");
//Serial.println(Vol_total, 2);


return fluxo;
return Vol_total;


}*/


// --------------------------------------------------------------------------------------------------------

//FUNÇÃO PARA ENVIO














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
//sensor_vazao();
Leitura_temperatura();
//sensor_nivel();
}







void loop() {

//variaveis a serem lidas e enviadas

float real_php;
float real_temp;
bool real_state_nivel;
float real_voltage;
float fluxo;
float volume;
//nt Sensor_nivel = digitalRead(pinSensor_nivel);
//Verificação da tensão da bateria e sensor de nivel

while (sensor_tensao()<= 11.50 || digitalRead(pinSensor_nivel) == HIGH ){
  digitalWrite(RelePin, HIGH); //bomba ligada
  Serial.print("Tensao: ");
  Serial.println(sensor_tensao(), 2);
  Serial.println("Bomba desligada");

}

unsigned long tempoAtual = millis(); // Tempo atual em milissegundos
unsigned long intervalo = tempoAtual - tempoAnterior; // Calcula o intervalo de tempo

if (intervalo >= 500) { // Atualiza a cada 500 ms
    tempoAnterior = tempoAtual; // Atualiza o tempo anterior
    fluxo = (pulsos / fatorCalibracao); // Calcula a taxa de fluxo
    volume += (fluxo / 110.0); // Calcula o volume total

digitalWrite(RelePin, LOW); //bomba desligada
Serial.println("Bomba ligada");
//bomba ligada leitura dos sensores <-------------------->
if(digitalRead(RelePin) == LOW){
Leitura_PH(real_php);
Serial.print("Temperatura: ");
Serial.println(Leitura_temperatura(), 2);
Serial.print("PH: ");
Serial.println(real_php, 2);
Serial.print("Fluxo: ");
Serial.println(fluxo, 2);
Serial.print("Volume: ");
Serial.println(volume, 2);
Serial.print("Tensao: ");
Serial.println(sensor_tensao(), 2);



}

//envio dos dados

delay(500);



}
}
