from rest_framework import serializers
from .models import Usuario, Endereco, Dispositivo, Sensor, DadosSensor, Alerta, Consumo
from django.contrib.auth.models import User

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'senha', 'ativo', 'tipo_usuario', 'profissao', 'criado_em', 'atualizado_em']
        extra_kwargs = {'senha': {'write_only': True}}

    def create(self, validated_data):
        usuario = Usuario(**validated_data)
        usuario.set_password(validated_data['senha'])
        usuario.save()
        return usuario

class EnderecoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Endereco
    fields = '__all__'

class DispositivoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Dispositivo
    fields = '__all__'

class SensorSerializer(serializers.ModelSerializer):
  class Meta:
    model = Sensor
    fields = '__all__'

class DadosSensorSerializer(serializers.ModelSerializer):
  class Meta:
    model = DadosSensor
    fields = '__all__'

class AlertaSerializer(serializers.ModelSerializer):
  class Meta:
    model = Alerta
    fields = '__all__'

class ConsumoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Consumo
    fields = '__all__'

# Default user class from django
class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User 
        fields = ['id', 'username', 'password', 'email']