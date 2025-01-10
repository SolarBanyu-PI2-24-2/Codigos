void setup() {
  Serial.begin(115200);
}

void loop() {
  int leituraADC = analogRead(34);
  float tensaoReal = leituraADC * 3.3 / 4095.0; // Tensão real = valor lido no ADC * tensão de referência / resolução
  Serial.print("Tensão real: ");
  Serial.println(tensaoReal, 2); // Exibe com 2 casas decimais
  delay(250);