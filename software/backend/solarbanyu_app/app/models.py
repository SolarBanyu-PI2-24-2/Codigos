from django.db import models
from django.contrib.auth.models import AbstractUser

# Modelo de Usuário
class User(AbstractUser):
    email = models.EmailField(unique=True)
    profissao = models.CharField(max_length=100, blank=True, null=True)
    ativo = models.BooleanField(default=True)
    tipo = models.CharField(max_length=50, blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


# Modelo de Endereço
class Endereco(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enderecos")
    cep = models.CharField(max_length=10)
    rua = models.CharField(max_length=255)
    numero = models.CharField(max_length=10)
    complemento = models.CharField(max_length=255, blank=True, null=True)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

# Modelo de Dispositivo
class Dispositivo(models.Model):
    num_serie = models.CharField(max_length=100, unique=True)
    modelo = models.CharField(max_length=100)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="dispositivos")
    ativo = models.BooleanField(default=True)
    data_instalacao = models.DateField()
    capacidade = models.FloatField()
    data_filtro = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

# Modelo de Sensor
class Sensor(models.Model):
    dispositivo = models.ForeignKey(Dispositivo, on_delete=models.CASCADE, related_name="sensores")
    tipo = models.CharField(max_length=100)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

# Modelo de Dados do Sensor
class DadoSensor(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name="dados")
    valor = models.FloatField()
    unidade = models.CharField(max_length=20)
    criado_em = models.DateTimeField(auto_now_add=True)

# Modelo de Alerta
class Alerta(models.Model):
    dispositivo = models.ForeignKey(Dispositivo, on_delete=models.CASCADE, related_name="alertas")
    tipo = models.CharField(max_length=100)
    descricao = models.TextField()
    resolvido = models.BooleanField(default=False)
    prioridade = models.IntegerField()
    criado_em = models.DateTimeField(auto_now_add=True)

# Modelo de Consumo
class Consumo(models.Model):
    dispositivo = models.ForeignKey(Dispositivo, on_delete=models.CASCADE, related_name="consumos")
    valor = models.FloatField()
    criado_em = models.DateTimeField(auto_now_add=True)
