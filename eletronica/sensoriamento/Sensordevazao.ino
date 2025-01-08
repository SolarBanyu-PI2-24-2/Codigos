<em>// Definindo o pino ao qual o sensor está conectado
const int sensorPin = 1; // Altere conforme necessário
 
// Variáveis para cálculo de vazão
volatile unsigned int pulseCount; // Variável para contar pulsos
float flowRate; // Vazão em litros por minuto
unsigned int flowMilliLitres; // Quantidade de água passada (em mililitros)
unsigned long totalMilliLitres; // Total de água passada (em mililitros)
unsigned long oldTime; // Armazena o tempo anterior
 
// Interrupção para contar pulsos
void pulseCounter() {
  pulseCount++;
}
 
void setup() {
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);
  digitalWrite(sensorPin, HIGH); // Ativar pull-up
  pulseCount = 0;
  flowRate = 0.0;
  flowMilliLitres = 0;
  totalMilliLitres = 0;
  oldTime = 0;
 
  // Configura a interrupção para contar pulsos
  attachInterrupt(digitalPinToInterrupt(sensorPin), pulseCounter, FALLING);
}
 
void loop() {
  // Calcula o tempo decorrido
  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - oldTime;</em>
<em>
  // Se passou um segundo desde a última vez
  if (elapsedTime > 1000) {</em>
<em>
    // Calcula a vazão
    flowRate = (1000.0 / (elapsedTime)) * pulseCount;
 
    // Resetar contadores
    pulseCount = 0;
    oldTime = currentTime;
 
    // Calcula a quantidade de água passada
    flowMilliLitres = (flowRate / 60) * 1000;
 
    // Adiciona à quantidade total
    totalMilliLitres += flowMilliLitres;
 
    // Imprime os resultados
    Serial.print("Vazao: ");
    Serial.print(flowRate);
    Serial.print(" L/min - ");
    Serial.print("Quantidade de agua: ");
    Serial.print(flowMilliLitres);
    Serial.print(" mL/segundo - Total: ");
    Serial.print(totalMilliLitres);
    Serial.println(" mL");
  }
}</em>