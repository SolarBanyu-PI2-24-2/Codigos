#include <arduino.h>

// Configurações
int pHSense          = 0; // Pinagem ADC para o sensor de pH GPIO0
int samples          = 20; // Número de amostras para média
float adc_resolution = 4095.0; // Resolução ADC do ESP32-C6 (12 bits)
float vRef           = 3.3; // Tensão de referência do ADC do ESP32-C6

void setup() {
  Serial.begin(115200); // Ajuste a taxa de baud para maior eficiência no ESP32
  delay(100);
  Serial.println("Saravati PH4502C - ESP32-C6");
}

// Função para calcular o pH baseado na tensão
float ph(float voltage) {
  return 7 + ((2.5 - voltage) / 0.18);
}

void loop() {
  int measurings = 0;
  
  // Coleta de múltiplas leituras para maior precisão
  for (int i = 0; i < samples; i++) {
    int from_ad = analogRead(pHSense);
    measurings += from_ad;
    delay(10);
    Serial.print("ADC Raw Value: ");
    Serial.println(from_ad);
  }
  
  // Cálculo da média e conversão para tensão
  float averageAdc = measurings / (float)samples;
  float voltage = (averageAdc / adc_resolution) * vRef;

  // Cálculo e exibição do pH
  Serial.print("pH: ");
  Serial.println(ph(voltage));
  
  delay(3000); // Intervalo entre medições
}
