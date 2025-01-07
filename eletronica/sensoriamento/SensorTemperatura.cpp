Leitura do sensor de temperatura DS18B20 (v1.0).
*
* Realiza a leitura da temperatura utilizando sensor DS18B20.
* Apos a leitura, no monitor serial ira imprimir os dados lidos.
*


#include <OneWire.h>
#include <DallasTemperature.h>

const int PINO_ONEWIRE = 7; // Define pino do sensor
OneWire oneWire(PINO_ONEWIRE); // Cria um objeto OneWire
DallasTemperature sensor(&oneWire); // Informa a referencia da biblioteca dallas temperature para Biblioteca onewire
DeviceAddress endereco_temp; // Cria um endereco temporario da leitura do sensor

void setup() {
  Serial.begin(9600); // Inicia a porta serial
  Serial.println("Medindo Temperatura"); // Imprime a mensagem inicial
  sensor.begin(); ; // Inicia o sensor
}
  
void loop() {
  sensor.requestTemperatures(); // Envia comando para realizar a conversão de temperatura
  if (!sensor.getAddress(endereco_temp,0)) { // Encontra o endereco do sensor no barramento
    Serial.println("SENSOR NAO CONECTADO"); // Sensor conectado, imprime mensagem de erro
  } else {
    Serial.print("Temperatura = "); // Imprime a temperatura no monitor serial
    Serial.println(sensor.getTempC(endereco_temp), 1); // Busca temperatura para dispositivo
  }
  delay(1000);
}


///////////////////////////////////////////////////////////////////