from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import status, generics

from .models import Usuario, Endereco, Dispositivo, Sensor, DadosSensor, Alerta, Consumo
from .serializers import UsuarioSerializer, EnderecoSerializer, DispositivoSerializer, SensorSerializer, DadosSensorSerializer, AlertaSerializer, ConsumoSerializer
from .serializers import UserSerializer

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response

from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import get_object_or_404


@api_view(['POST'])
def login(request):
  user = get_object_or_404(User, username=request.data['username'])
  if not user.check_password(request.data['password']):
     return Response("missing user", status=status.HTTP_404_NOT_FOUND)
  token, created = Token.objects.get_or_create(user=user)
  serializer = UserSerializer(instance=user)
  return Response({'token': token.key, 'user': serializer.data})

@api_view(['POST'])
def signup(request):
  serializer = UserSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
    user = User.objects.get(username=request.data['username'])
    user.set_password(request.data['password'])
    user.save()
    token = Token.objects.create(user=user)
    return Response({"token": token.key, "user": serializer.data})
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")

# Create your views here.
def index(request):
  return HttpResponse("SolarBanyu")

def water_amount_over_time(request):
  return HttpResponse(1)

def water_amount_per_day(request):
  return HttpResponse(1)

def water_temperature_over_time(request):
  return HttpResponse(1)

def water_temperature_amplitude_per_day(request):
  return HttpResponse(1)

def water_ph_over_time(request):
  return HttpResponse(1)

def battery_voltage_over_time(request):
  return HttpResponse(1)

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
