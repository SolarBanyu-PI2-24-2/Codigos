const int pinoSensor = 25; // Pino digital para o sensor
volatile int pulsos = 0;
const float fatorCalibracao = 4.78; // Fator de calibração do sensor de acordo com a sua alimentação

float fluxoLitrosPorMinuto = 0.0; // Taxa de fluxo em L/min
float volumeTotal = 0.0; // Volume total em litros

unsigned long tempoAnterior = 0; // Armazena o tempo da última atualização

void IRAM_ATTR contarPulsos() {
  pulsos++; // Incrementa a contagem de pulsos
}

void setup() {
  Serial.begin(115200); // Inicializa a comunicação serial
  Serial.println("Monitoramento de Vazão com ESP32");
  pinMode(pinoSensor, INPUT_PULLUP); // Configura o pino do sensor como entrada
  attachInterrupt(digitalPinToInterrupt(pinoSensor), contarPulsos, RISING); // Configura interrupção para contar pulsos
}

void loop() {
  unsigned long tempoAtual = millis(); // Tempo atual em milissegundos
  unsigned long intervalo = tempoAtual - tempoAnterior; // Calcula o intervalo de tempo

  if (intervalo >= 500) { // Atualiza a cada 500 ms
    tempoAnterior = tempoAtual; // Atualiza o tempo anterior
    fluxoLitrosPorMinuto = (pulsos / fatorCalibracao); // Calcula a taxa de fluxo
    volumeTotal += (fluxoLitrosPorMinuto / 110.0); // Calcula o volume total

    Serial.print("Fluxo: ");
    Serial.print(fluxoLitrosPorMinuto, 2); // Exibe a taxa de fluxo com 2 casas decimais
    Serial.println(" L/min");

    Serial.print("Volume Total: ");
    Serial.print(volumeTotal, 2); // Exibe o volume total com 2 casas decimais
    Serial.println(" L");

    pulsos = 0; // Reinicia a contagem de pulsos
  }
}