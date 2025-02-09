import os
import django
import random
from datetime import datetime, timedelta

# Configurar o Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "solarbanyu_app.settings")
django.setup()

from app.models import User, Dispositivo, Sensor, DadoSensor, Alerta

# ✅ CONFIGURAÇÕES
USER_EMAIL = "yasmim@email.com"  
NUM_DADOS_POR_SENSOR = 10  
NUM_ALERTAS = 5  
PERIODO_DIAS = 7  

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

# ✅ CRIAR SENSORES SE NÃO EXISTIREM
sensores_tipos = ["pH", "Volume de Água", "Energia Consumida", "Temperatura da Água"]
sensores = {}

for tipo in sensores_tipos:
    sensor, created = Sensor.objects.get_or_create(dispositivo=dispositivo, tipo=tipo, ativo=True)
    sensores[tipo] = sensor
    if created:
        print(f"Sensor '{tipo}' criado.")

# ✅ GERAR DADOS PARA OS SENSORES NOS ÚLTIMOS 7 DIAS
for sensor_tipo, sensor in sensores.items():
    for _ in range(NUM_DADOS_POR_SENSOR):
        valor = random.uniform(5.5, 9.0) if sensor_tipo == "pH" else random.uniform(10, 100)
        unidade = (
            "Celsius" if sensor_tipo == "Temperatura da Água" 
            else "L" if sensor_tipo == "Volume de Água" 
            else "kWh" if sensor_tipo == "Energia Consumida" 
            else ""
        )
        criado_em = datetime.now() - timedelta(days=random.randint(0, PERIODO_DIAS))

        dado = DadoSensor(sensor=sensor, valor=valor, unidade=unidade, criado_em=criado_em)
        dado.save()

print(f"{NUM_DADOS_POR_SENSOR * len(sensores)} leituras de sensores criadas com sucesso!")

# ✅ GERAR ALERTAS ALEATÓRIOS NOS ÚLTIMOS 7 DIAS
TIPOS_ALERTAS = ["Vazamento", "Alto Consumo de Energia", "Falha no Sensor", "Troca de Filtro Recomendada", "Sistema Offline"]
PRIORIDADE_CHOICES = {  # Mapeamento de prioridade
    "Baixa": 1,
    "Média": 2,
    "Alta": 3,
    "Urgente": 4
}

for _ in range(NUM_ALERTAS):
    tipo = random.choice(TIPOS_ALERTAS)
    prioridade_str = random.choice(list(PRIORIDADE_CHOICES.keys()))  # Escolhe uma prioridade textual
    prioridade_int = PRIORIDADE_CHOICES[prioridade_str]  # Converte para número
    descricao = f"Alerta gerado automaticamente: {tipo}"
    criado_em = datetime.now() - timedelta(days=random.randint(0, PERIODO_DIAS))
    resolvido = random.choice([True, False])

    alerta = Alerta(
        dispositivo=dispositivo, 
        tipo=tipo, 
        descricao=descricao, 
        prioridade=prioridade_int,  # Agora estamos salvando um número!
        resolvido=resolvido, 
        criado_em=criado_em
    )
    alerta.save()

print(f"{NUM_ALERTAS} alertas gerados com sucesso!")
