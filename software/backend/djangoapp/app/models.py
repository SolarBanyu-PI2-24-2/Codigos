from django.db import models

from django.db import models
import uuid

class Usuario(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255, null=False)
    email = models.CharField(max_length=255, unique=True, null=False)
    senha = models.CharField(max_length=255, null=False)
    criado_em = models.DateTimeField(auto_now_add=True, null=False)
    ativo = models.BooleanField(default=True, null=False)
    tipo_usuario = models.CharField(max_length=50, null=False)
    profissao = models.CharField(max_length=50, null=False)

    def __str__(self):
        return self.nome



class Endereco(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cep = models.CharField(max_length=8, null=False)
    rua = models.CharField(max_length=255, null=False)
    numero = models.CharField(max_length=10, null=False)
    complemento = models.CharField(max_length=255, null=True)
    cidade = models.CharField(max_length=100, null=False)
    estado = models.CharField(max_length=2, null=False)

    def __str__(self):
        return f"{self.rua}, {self.numero} - {self.cidade}"
    
class Dispositivo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    modelo = models.CharField(max_length=255, null=False)
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    criado_em = models.DateTimeField(auto_now_add=True, null=False)
    ativo = models.BooleanField(default=True, null=False)
    data_instalacao = models.DateTimeField(null=False)
    capacidade = models.FloatField(null=False)
    num_serie = models.CharField(max_length=100, null=False)
    data_filtro = models.DateTimeField(null=False)
    endereco_id = models.ForeignKey(Endereco, on_delete=models.CASCADE)

    def __str__(self):
        return self.modelo

class TipoSensor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255, null=False)
    descricao = models.TextField()

    def __str__(self):
        return self.nome
    
class Sensor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dispositivo_id = models.ForeignKey(Dispositivo, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=50, null=False)
    criado_em = models.DateTimeField(auto_now_add=True, null=False)
    ativo = models.BooleanField(default=True, null=False)
    tipo_sensor_id = models.ForeignKey(TipoSensor, on_delete=models.CASCADE)

    def __str__(self):
        return self.tipo
    
class DadosSensor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sensor_id = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    valor = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    unidade = models.CharField(max_length=50, null=False)
    criado_em = models.DateTimeField(auto_now_add=True, null=False)

    def __str__(self):
        return f"{self.valor} {self.unidade}"
    
class Alerta(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dispositivo_id = models.ForeignKey(Dispositivo, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=50, null=False)
    descricao = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True, null=False)
    atualizado_em = models.DateTimeField(auto_now=True, null=True)
    resolvido = models.BooleanField(default=False, null=False)
    prioridade = models.CharField(max_length=20, choices=[('Urgente', 'Urgente'), ('Rotina', 'Rotina'), ('Média', 'Média'), ('Baixa', 'Baixa')], null=False)

    def __str__(self):
        return f"{self.tipo} - {self.descricao}"

class Consumo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dispositivo_id = models.ForeignKey(Dispositivo, on_delete=models.CASCADE)
    valor = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    criado_em = models.DateTimeField(auto_now_add=True, null=False)
    atualizado_em = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return str(self.valor)

