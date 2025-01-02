// Definições
#define PH_PIN 2         // Pino GPIO2 da ESP32 conectado ao sensor de pH
#define SAMPLES 10       // Número de amostras para média
#define ADC_MAX 4095.0   // Valor máximo do ADC (12 bits)
#define VREF 3.3         // Tensão de referência da ESP32 (em volts)

float calibrationOffset = 0.0; // Ajuste de calibração do pH

void setup() {
  Serial.begin(115200); // Inicializa a comunicação serial
  Serial.println("Teste de funcionamento do sensor de pH BNC PH4502C");
}

void loop() {
  float voltage = readAverage(PH_PIN); // Lê a média da tensão no pino do sensor
  float pH = voltageToPH(voltage);    // Converte a tensão para valor de pH

  Serial.print("Tensão (V): ");
  Serial.print(voltage, 3);
  Serial.print(" | pH: ");
  Serial.println(pH, 2);

  delay(1000); // Intervalo entre leituras
}

// Função para ler a média das amostras do sensor
float readAverage(int pin) {
  float total = 0;
  for (int i = 0; i < SAMPLES; i++) {
    total += analogRead(pin);
    delay(10); // Pequeno intervalo entre leituras
  }
  return (total / SAMPLES) * (VREF / ADC_MAX); // Conversão para tensão (0-VREF)
}

// Função para converter a tensão em valor de pH
float voltageToPH(float voltage) {
  // Fórmula baseada na calibração típica do sensor PH4502C
  float pH = 7.0 + ((2.5 - voltage) / 0.18); // Ajuste para 25°C padrão
  return pH + calibrationOffset;            // Inclui offset de calibração
}
