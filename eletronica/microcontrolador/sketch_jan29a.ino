#include <OneWire.h>
#include <DallasTemperature.h>





// -------------------------------------------------------------------------
//CONFIGURAÇÃO GPIOS
int pHSense          = 36; // Gpio 36 ADC1
const int PINO_ONEWIRE = 35; // Define o pino do sensor de temperatura
const int pinSensor = 27;  // Pino digital conectado ao sensor de nivel
int pintensao = 32; // pino analogico para sensor tensao
const int RelePin = 13; // pino do rele OLHAR NA PLACA ANTES!!!!!!
const int pinovazao = 25; // Pino digital para o sensor

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
float Leitura_temperatura(float temp){
 OneWire oneWire(PINO_ONEWIRE); // Cria um objeto OneWire
DallasTemperature sensor(&oneWire); // Informa a referência da biblioteca DallasTemperature para o OneWire
DeviceAddress endereco_temp; // Armazena o endereço do sensor no barramento

const int BUFFER_SIZE = 10; // Tamanho do buffer (10 leituras para 5 segundos a 0,5s cada)
float buffer[BUFFER_SIZE]; // Array para armazenar as leituras
int bufferIndex = 0; // Índice atual do buffer

unsigned long lastMeasurementTime = 0; // Armazena o tempo da última leitura
unsigned long lastDisplayTime = 0; // Armazena o tempo da última exibição
const unsigned long MEASUREMENT_INTERVAL = 500; // Intervalo entre leituras (0,5s)
const unsigned long DISPLAY_INTERVAL = 2000; // Intervalo entre exibições (5s)

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

  Serial.begin(115200); // Inicia a comunicação serial
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
bool sensor_nivel(bool estado_sensor){

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

}
// --------------------------------------------------------------------------------------------------------
//FUNÇÃO SENSOR DE TENSÃO
float sensor_tensao(float bat_voltage){
  int leituraADC = analogRead(pintensao);
   bat_voltage = leituraADC * 3.3 / 4095.0; // Tensão real = valor lido no ADC * tensão de referência / resolução
  return bat_voltage;
}

// --------------------------------------------------------------------------------------------------------

//FUNÇÃO SENSOR DE VAZÃO

void IRAM_ATTR contarPulsos(volatile int pulsos) {
  pulsos++; // Incrementa a contagem de pulsos
}
float sensor_vazao(float fluxo,float Vol_total){
int pulsos = 0;
const float fatorCalibracao = 4.78; // Fator de calibração do sensor de acordo com a sua alimentação
unsigned long tempoAnterior = 0; // Armazena o tempo da última atualização
unsigned long tempoUltimoPulso = 0; // Armazena o tempo do último pulso
bool estadoAnteriorSensor = LOW; // Estado anterior do sensor
unsigned long tempoAtual = millis(); // Tempo atual em milissegundos
unsigned long intervalo = tempoAtual - tempoAnterior; // Calcula o intervalo de tempo

// Verifica o estado atual do sensor
 bool estadoAtualSensor = digitalRead(pinovazao);

// Detecta uma mudança de estado de LOW para HIGH (pulso)
if (estadoAtualSensor == HIGH && estadoAnteriorSensor == LOW) {
    // Incrementa a contagem de pulsos
    pulsos++;
    }

  // Atualiza o estado anterior do sensor
  estadoAnteriorSensor = estadoAtualSensor;

  // Atualiza a cada 500 ms
  if (intervalo >= 500) {
    tempoAnterior = tempoAtual; // Atualiza o tempo anterior
    fluxo = (pulsos / fatorCalibracao); // Calcula a taxa de fluxo
    Vol_total += (fluxo / 110.0); // Calcula o volume total
  }
return fluxo;
return Vol_total;

}

// --------------------------------------------------------------------------------------------------------

//FUNÇÃO PARA ENVIO














// --------------------------------------------------------------------------------------------------------

void setup() {

  // Configura o pino do sensor de nivel como entrada
  pinMode(pinSensor, INPUT);
  // Configure o pino DO RELE como saída
  pinMode(RelePin, OUTPUT);
  // Configura o pino do sensor como entrada
  pinMode(pinovazao, INPUT_PULLUP); 
  //attachInterrupt(digitalPinToInterrupt(pinovazao), contarPulsos, RISING); // Configura interrupção para contar pulsos




}







void loop() {

//variaveis a serem lidas e enviadas

float real_php;
float real_temp;
bool real_state_nivel;
float real_voltage;
float real_fluxo;
float real_volume;

//Verificação da tensão da bateria e sensor de nivel

if (sensor_tensao(real_voltage)>= 11.50 && sensor_nivel(real_state_nivel) == false ){
  digitalWrite(RelePin, HIGH); //bomba ligada
}
else{
  digitalWrite(RelePin, LOW); //bomba desligada
}
///bomba ligada leitura dos sensores
if(RelePin == HIGH){
sensor_vazao(real_fluxo,real_volume);
Leitura_PH(real_php);
Leitura_temperatura(real_temp);
}

//envio dos dados





}
