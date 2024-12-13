Leitura do sensor de temperatura DS18B20 (v1.0).
*
* Realiza a leitura da temperatura utilizando sensor DS18B20.
* Apos a leitura, no monitor serial ira imprimir os dados lidos.
*
* Copyright 2019 RoboCore.
* Escrito por Renan Piva (10/04/2019).
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by

#include <OneWire.h>
#include <DallasTemperature.h>

const int PINO_ONEWIRE = 12; // Define pino do sensor
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



/********************************************************************
* Controle de temperatura com sensor DS18B20 (v1.0)
*
* Usando um rele para acionar um dispositivo para controle de temperatura do ambiente
* Caso a temperatura esteja elevada, um dispositivo sera acionado pelo rele.
*
* Copyright 2019 RoboCore.
* Escrito por Renan Piva (10/04/2019).
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version (<https://www.gnu.org/licenses/>).
*******************************************************************************/

// Inclusao da bibliotecas 
#include <OneWire.h>
#include <DallasTemperature.h>

const int PINO_ONEWIRE = 12; // Define pino do sensor
const int PINO_RELE = 13; // Informa pino do rele
OneWire oneWire(PINO_ONEWIRE); // Cria um objeto OneWire
DallasTemperature sensor(&oneWire); // Informa as referencias da biblioteca dallas temperature para biblioteca onewire
DeviceAddress endereco_temp; // Cria um endereco temporario da leitura do sensor

void setup() {
  Serial.begin(9600); // Inicia a porta serial
  Serial.println("Medindo temperatura"); // Imprime a mensagem inicial
  sensor.begin(); // Inicia o sensor
  pinMode(PINO_RELE, OUTPUT);
}
  
void loop() {
  sensor.requestTemperatures(); // Envia comandos para realizar uma conversao de temperatura
  if (!sensor.getAddress(endereco_temp,0)){ // Encontra o endereco de um determinado sinal no barramento
    Serial.println("SENSOR NAO CONECTADO"); // Sensor nao conectado imprime mensagem de erro
  } else {
    float temperatura = sensor.getTempC(endereco_temp);
    Serial.print("Temperatura = "); // Caso o sensor for reconhecido apresenta as infomacoes
    Serial.println(temperatura, 1);
  
    if (temperatura >= 30){ // Caso temperatura ultrapasse os 30 graus Celsius aciona o rele
      digitalWrite(PINO_RELE, HIGH); // Rele acionado
    } else  {
      digitalWrite(PINO_RELE, LOW); // Temperatura abaixo de 30 graus Celsius desliga o rele
    }
    delay(1000); // Espera 1 segundo para repetir a leitura
  }
}