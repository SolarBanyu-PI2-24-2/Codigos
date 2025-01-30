// Configuração do pino de entrada analógica
const int pinoSensor = 32; // GPIO34 (VP)

// Tensão de referência do ADC da ESP32 (3.3V)
const float tensaoReferencia = 2.72;

// Resolução do ADC da ESP32
const int resolucaoADC = 4095;

// Fator de escala do divisor de tensão
// R1 = 30kΩ e R2 = 7.5kΩ
const float fatorDivisor = (30.0 + 7.5) / 7.5; // 5

void setup() {
  // Inicializa a comunicação serial
  Serial.begin(115200);
  Serial.println("Monitoramento de Tensão DC com ESP32");
}

void loop() {
  // Lê o valor analógico do pino
  int valorAnalogico = analogRead(pinoSensor);

  // Converte o valor lido para tensão no divisor
  float tensaoSensor = (valorAnalogico / float(resolucaoADC)) * tensaoReferencia;

  // Calcula a tensão real antes do divisor
  float tensaoReal = tensaoSensor * fatorDivisor;

  // Exibe os resultados no monitor serial
  Serial.print("Tensão medida: ");
  Serial.print(tensaoReal);
  Serial.println(" V");

  // Aguarda 500ms antes da próxima leitura
  delay(2000);
}