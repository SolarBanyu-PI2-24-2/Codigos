#include <esp_adc_cal.h>

// Configuração do pino de entrada analógica
const int pinoSensor = 34; // GPIO34 (VP)

// Tensão de referência real (3.3V)
const float tensaoReferencia = 3.3;

// Fator de escala do divisor de tensão
// R1 = 30kΩ e R2 = 7.5kΩ
const float fatorDivisor = (30.0 + 7.5) / 7.5; // 5

// Parâmetros de calibração
esp_adc_cal_characteristics_t *adc_chars;
const adc_bits_width_t width = ADC_WIDTH_BIT_12; // Resolução de 12 bits
const adc_atten_t atten = ADC_ATTEN_DB_11;       // Atenuação para maior faixa (0 a ~3.3V)
const adc_unit_t unit = ADC_UNIT_1;              // Usando ADC1

void setup() {
  // Inicializa a comunicação serial
  Serial.begin(115200);
  Serial.println("Monitoramento de Tensão DC com ESP32 - Tempo Real");

  // Configura o ADC com largura e atenuação
  analogSetWidth(12); // Resolução de 12 bits
  analogSetAttenuation(atten);

  // Aloca memória para características do ADC
  adc_chars = (esp_adc_cal_characteristics_t *)calloc(1, sizeof(esp_adc_cal_characteristics_t));

  // Calibra o ADC usando tensão de referência padrão (efetiva em 3.3V)
  esp_adc_cal_characterize(unit, atten, width, 1100, adc_chars); // Valor padrão 1100mV para a ESP32
}

void loop() {
  // Lê o valor analógico do ADC
  uint32_t leituraADC = analogRead(pinoSensor);

  // Ajusta a leitura para a tensão calibrada
  uint32_t tensaoCalibrada = esp_adc_cal_raw_to_voltage(leituraADC, adc_chars);

  // Calcula a tensão real antes do divisor
  float tensaoReal = (tensaoCalibrada / 1000.0) * fatorDivisor;

  // Exibe o valor no monitor serial em tempo real
  Serial.print("Tensão medida: ");
  Serial.print(tensaoReal, 3); // 3 casas decimais
  Serial.println(" V");

  // Pequeno atraso para estabilidade visual (ajustável conforme necessário)
  delay(100);
}