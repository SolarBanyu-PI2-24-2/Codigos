import os
import django
import random
from datetime import datetime, timedelta

# Configurar o Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "solarbanyu_app.settings")
django.setup()

from app.models import User, Dispositivo, Sensor, DadoSensor, Alerta

# ✅ CONFIGURAÇÕES
USER_EMAIL = "auroragama@email.com"  # Email do usuário para o qual adicionar dados
NUM_DADOS_POR_SENSOR = 8  # O número de dados a serem adicionados
PERIODO_DIAS = 7  # O intervalo de tempo (em dias) para os dados a serem criados

# ✅ BUSCAR USUÁRIO
try:
    usuario = User.objects.get(email=USER_EMAIL)
except User.DoesNotExist:
    print(f"Usuário com email {USER_EMAIL} não encontrado.")
    exit()

# ✅ BUSCAR DISPOSITIVO DO USUÁRIO
try:
    dispositivo = Dispositivo.objects.filter(usuario=usuario).first()
    if not dispositivo:
        print(f"Nenhum dispositivo encontrado para o usuário {USER_EMAIL}.")
        exit()
except Exception as e:
    print(f"Erro ao buscar dispositivo: {e}")
    exit()

# ✅ BUSCAR SENSOR COM sensor_id = 2
sensor = Sensor.objects.filter(dispositivo=dispositivo, id=2).first()
if not sensor:
    print("Sensor com ID 2 não encontrado.")
    exit()

# ✅ GERAR 20 DADOS PARA O SENSOR COM sensor_id = 2 NOS ÚLTIMOS 7 DIAS
for _ in range(NUM_DADOS_POR_SENSOR):
    valor = random.uniform(10, 100)  # Exemplo de valor, ajustado para o tipo de sensor
    unidade = "L"  # Unidade do sensor de volume de água
    criado_em = datetime.now() - timedelta(days=random.randint(0, PERIODO_DIAS))  # Gerando uma data aleatória nos últimos 7 dias

    dado = DadoSensor(sensor=sensor, valor=valor, unidade=unidade, criado_em=criado_em)
    dado.save()

print(f"{NUM_DADOS_POR_SENSOR} dados do sensor com ID 2 criados com sucesso!")

