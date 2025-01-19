import traceback

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

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

from .lib.response import json_success_response, json_error_response

def api_interface(func):
  def handle_errors(*args, **kwargs):
    try:
      return func(*args, **kwargs)
    except:
      return json_error_response(message = traceback.format_exc())
  return handle_errors

def fetch_data_filters(request):
  return (request.GET.get('before', '3000-01-01'), request.GET.get('after', '2000-01-01'))

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

# Vazão ao Longo do Tempo
@api_interface
def vazao_tempo(request, num_serie_dispositivo):
  """
  Retorna todas as medições de vazão d'água no range especificado no seguinte formato:
  [
    {
      "valor": 99.0,
      "unidade": "L/min",
      "criado_em": "2020-01-01T00:00:00.0"
    }
  ]
  """
  before, after = fetch_data_filters(request)
  response_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, sensor_id__tipo=Sensor.VAZAO_AGUA, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  return json_success_response(data = response_data)


# Volume Acumulado por Dia
# Barras
# Dias
# Volume (L)
# Dados de vazão
# Total acumulado por dia
def water_amount_per_day(request):
  return HttpResponse(1)

# Temperatura ao Longo do Tempo
# Linha
# Tempo
# Temperatura (°C)
# Dados de temperatura
# Média, valores extremos
def water_temperature_over_time(request):
  return HttpResponse(1)

# Amplitude Térmica
# Área
# Tempo
# Temperatura (°C)
# Dados de temperatura
# Diferença entre máximo e mínimo diário
def water_temperature_amplitude_per_day(request):
  return HttpResponse(1)

# pH ao Longo do Tempo
# Linha
# Tempo
# pH
# Dados de pH
# Média, desvio padrão, erro percentual
def water_ph_over_time(request):
  return HttpResponse(1)

# pH x Temperatura
# Dispersão
# Temperatura (°C)
# pH
# Dados de pH e temperatura
# Classificação ácido/base (0–6 ácido, 7 neutro, 8–14 base)
def water_ph_x_temperature(request):
  return HttpResponse(1)

# Estado de Nível de Água (Boia)
# Barras
# Tempo
# Estado (presença/ausência)
# Dados binários de presença
# Contagem de transições, duração do estado
def water_level(request):
  return HttpResponse(1)

# Mudança no Nível de Água ao Longo do Tempo
# Linha
# Tempo
# Altura do Nível (m)
# Dados de altura
# Média, valores extremos, taxa de enchimento
def water_level_change_over_time(request):
  return HttpResponse(1)

# Tensão da Bateria ao Longo do Tempo
# Linha
# Tempo
# Tensão (V)
# Dados de tensão
# Média, energia total acumulada, potência
def battery_voltage_over_time(request):
  return HttpResponse(1)

# Consumo Total de Água e Energia
# Linha Dupla
# Tempo
# Volume (L), Energia (kWh)
# Dados de volume e energia
# Tendência acumulativa
def water_and_energy_consumption(request):
  return HttpResponse(1)

def water_flow_x_temperature(request):
  return HttpResponse(1)

# Eficiência de Dessalinização
# Linha
# Tempo
# Razão (água/energia)
# Dados de água dessalinizada e energia
# Média da eficiência por dia
def desalinization_efficience(request):
  return HttpResponse(1)

def consumption_by_system_state(request):
  return HttpResponse(1)

# Comparação de Níveis de Água entre Unidades
# Barras Comparativas
# Unidades
# Nível (médio)
# Dados de nível de diferentes unidades
# Diferença de altura entre unidades
def water_level_in_many_units(request):
  return HttpResponse(1)

# Histograma de Frequências de pH
# Histograma
# Faixas de pH
# Frequência
# Dados de pH
# Distribuição de pH no período analisado
def water_ph_grouped_in_time(request):
  return HttpResponse(1)

# Tensão vs. Vazão
# Dispersão
# Vazão (L/min)
# Tensão (V)
# Dados de vazão e tensão
# Correlação entre tensão e vazão
def water_flow_x_system_votalge(request):
  return HttpResponse(1)

# Eventos Críticos ao Longo do Tempo
# Linha com Marcadores
# Tempo
# Eventos (picos críticos)
# Dados de vazão, temperatura
# Identificação de picos simultâneos
def critical_events_over_time(request):
  return HttpResponse(1)

# Vazão e Volume Acumulado
# Barras e Linha
# Tempo
# Vazão (L/min), Volume (L)
# Dados de vazão
# Média diária, volume acumulado semanal
# # Aqui da pra fazer chamando o endpoint de vazão e o de volume


# Temperatura e pH Combinados
# Dispersão
# Temperatura (°C)
# pH
# Dados de temperatura e pH
# Identificação de faixas críticas de qualidade da água
# # Aqui da pra fazer chamando o endpoint de temperatura e o de PH

# Bateria e Estado do Sistema
# Pizza
# Estado
# Porcentagem
# Dados de tensão e estado
# Tempo em carga/descarga e estado inativo
def battery_level_by_system_state(request):
  return HttpResponse(1)

# Histórico de Consumo de Energia
# Linha
# Tempo
# Energia (kWh)
# Dados de tensão
# Tendência de consumo médio por dia
def consumption_mean_per_day(request):
  return HttpResponse(1)

# Projeção de Consumo de Água
# Linha com Projeção
# Dias
# Volume Estimado (L)
# Dados de volume acumulado
# Previsão baseada em médias históricas
def water_consumption_prediction_per_day(request):
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
