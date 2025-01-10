from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import status, generics

from .models import Usuario, Endereco, Dispositivo, Sensor, DadosSensor, Alerta, Consumo
from .serializers import UsuarioSerializer, EnderecoSerializer, DispositivoSerializer, SensorSerializer, DadosSensorSerializer, AlertaSerializer, ConsumoSerializer

# Create your views here.
def index(request):
  return HttpResponse("SolarBanyu")

class UsuariosView(generics.ListCreateAPIView):
  queryset = Usuario.objects.all()
  serializer_class = UsuarioSerializer

class UsuarioView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Usuario.objects.all()
  serializer_class = UsuarioSerializer

class EnderecosView(generics.ListCreateAPIView):
  queryset = Endereco.objects.all()
  serializer_class = EnderecoSerializer

class EnderecoView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Endereco.objects.all()
  serializer_class = EnderecoSerializer

class DispositivosView(generics.ListCreateAPIView):
  queryset = Dispositivo.objects.all()
  serializer_class = DispositivoSerializer

class DispositivoView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Dispositivo.objects.all()
  serializer_class = DispositivoSerializer

class SensoresView(generics.ListCreateAPIView):
  queryset = Sensor.objects.all()
  serializer_class = SensorSerializer

class SensorView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Sensor.objects.all()
  serializer_class = SensorSerializer

class DadosSensoresView(generics.ListCreateAPIView):
  queryset = DadosSensor.objects.all()
  serializer_class = DadosSensorSerializer

class DadosSensorView(generics.RetrieveUpdateDestroyAPIView):
  queryset = DadosSensor.objects.all()
  serializer_class = DadosSensorSerializer

class AlertasView(generics.ListCreateAPIView):
  queryset = Alerta.objects.all()
  serializer_class = AlertaSerializer

class AlertaView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Alerta.objects.all()
  serializer_class = AlertasView

class ConsumosView(generics.ListCreateAPIView):
  queryset = Consumo.objects.all()
  serializer_class = ConsumoSerializer

class ConsumoView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Consumo.objects.all()
  serializer_class = ConsumoSerializer
