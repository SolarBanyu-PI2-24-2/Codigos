// Define o pino ao qual o sensor está conectado
const int pinSensor = 27;  // Pino digital conectado ao sensor

void setup() {
  // Configura o pino do sensor como entrada
  pinMode(pinSensor, INPUT);

  // Inicializa a comunicação serial para monitorar o estado do sensor
  Serial.begin(115200);
}

void loop() {
  // Lê o estado do sensor (HIGH ou LOW)
  int estadoSensor = digitalRead(pinSensor);

  // Verifica o estado do sensor e exibe no monitor serial
  if (estadoSensor == LOW) {
    Serial.println("Nível de água baixo");
  } else {
    Serial.println("Nível de água alto");
  }

  // Aguarda 500 milissegundos antes de verificar novamente
  delay(500);
}