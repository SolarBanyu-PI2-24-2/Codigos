import traceback

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db.models import Count

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
from django.db.models import Q

from django.shortcuts import get_object_or_404

from .api_lib.response import json_success_response, json_error_response

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
  user = get_object_or_404(User, Q(username=request.data['username']) | Q(email=request.data['username']))
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
@api_interface
def volume_acumulado_dia(request, num_serie_dispositivo):
  """
  Retorna o volume acumulado de água por dia considerando a média os dados de vazão coletados e multiplicando por 1440 (minutos diários);
  Aqui assume-se que quando o sistema está desligado o dado de vazão é enviado como 0 e os dados de vazão são enviados com no mínimo 1 minuto de intervalo.
  [
    {
      "valor": 99.0,
      "unidade": "L",
      "dia": "2020-01-01T00:00:00.0Z"
    }
  ]
  """
  before, after = fetch_data_filters(request)

  raw_data = list(DadosSensor.objects.raw(
    """
    SELECT 1 as id, (SUM("app_dadossensor"."valor") / COUNT(*)) * 1440 as valor, 'L' as unidade, DATE_TRUNC('day', "app_dadossensor"."criado_em") as dia
      FROM "app_dadossensor"
      INNER JOIN "app_sensor"
        ON ("app_dadossensor"."sensor_id_id" = "app_sensor"."id" AND "app_sensor"."dispositivo_id_id" = %s AND "app_sensor"."tipo" = %s)
      WHERE ("app_dadossensor"."criado_em" >= %s AND "app_dadossensor"."criado_em" < %s)
      GROUP BY DATE_TRUNC('day', "app_dadossensor"."criado_em")
    """,
    [
      num_serie_dispositivo,
      Sensor.VAZAO_AGUA,
      after,
      before,
    ]
  ))

  response_data = []
  for item in raw_data:
    response_data.append(
      {
        'valor': item.valor,
        'unidade': item.unidade,
        'dia': item.dia,
      }
    )

  return json_success_response(data = response_data)

# Temperatura ao Longo do Tempo
@api_interface
def temperatura_tempo(request, num_serie_dispositivo):
  """
  Retorna todas as medições de temperatura d'água no range especificado no seguinte formato:
  [
    {
      "valor": 99.0,
      "unidade": "ºC",
      "criado_em": "2020-01-01T00:00:00.0"
    }
  ]
  """
  before, after = fetch_data_filters(request)

  response_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, sensor_id__tipo=Sensor.TEMPERATURA_AGUA, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  return json_success_response(data = response_data)

# Amplitude Térmica
@api_interface
def amplitude_termica(request, num_serie_dispositivo):
  """
  Retorna a temperatura maxima e minima da água de cada dia presente no intervalo de tempo informado.
  [
    {
      "valor_minimo": 99.0,
      "valor_maximo": 99.0,
      "unidade": "ºC",
      "dia": "2020-01-01T00:00:00.0"
    }
  ]
  """
  before, after = fetch_data_filters(request)

  raw_data = list(
    DadosSensor.objects.raw(
      """
      SELECT 1 as id, MIN(valor) as valor_minimo, MAX(valor) as valor_maximo, 'ºC' as unidade, DATE_TRUNC('day', "app_dadossensor"."criado_em") as dia
        FROM "app_dadossensor"
        INNER JOIN "app_sensor"
          ON ("app_dadossensor"."sensor_id_id" = "app_sensor"."id" AND "app_sensor"."dispositivo_id_id" = %s AND "app_sensor"."tipo" = %s)
        WHERE ("app_dadossensor"."criado_em" >= %s AND "app_dadossensor"."criado_em" < %s)
        GROUP BY DATE_TRUNC('day', "app_dadossensor"."criado_em")
      """,
      [
        num_serie_dispositivo,
        Sensor.TEMPERATURA_AGUA,
        after,
        before,
      ]
    )
  )

  response_data = []
  for item in raw_data:
    response_data.append(
      {
        'valor_minimo': item.valor_minimo,
        'valor_maximo': item.valor_maximo,
        'dia': item.dia,
      }
    )

  return json_success_response(data = response_data)

# pH ao Longo do Tempo
# Linha
# Tempo
# pH
# Dados de pH
# Média, desvio padrão, erro percentual
@api_interface
def ph_tempo(request, num_serie_dispositivo):
  """
  Retorna todas as medições de ph d'água no range especificado no seguinte formato:
  [
    {
      "valor": 99.0,
      "unidade": "pH",
      "criado_em": "2020-01-01T00:00:00.0"
    }
  ]
  """
  before, after = fetch_data_filters(request)

  response_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, sensor_id__tipo=Sensor.PH_AGUA, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  return json_success_response(data = response_data)

# Estado de Nível de Água (Boia)
@api_interface
def presenca_agua(request, num_serie_dispositivo):
  """
  Retorna todas as medições de estado de presença de água no range especificado na boia (obs.: é dado binário):
  [
    {
      "valor": 1.0,
      "unidade": "Bool",
      "criado_em": "2020-01-01T00:00:00.0"
    }
  ]
  """
  before, after = fetch_data_filters(request)

  response_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, sensor_id__tipo=Sensor.PRESENCA_AGUA, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  return json_success_response(data = response_data)

# Mudança no Nível de Água ao Longo do Tempo
@api_interface
def nivel_agua(request, num_serie_dispositivo):
  """
  Retorna todas as medições de nível d'água no range especificado na boia:
  [
    {
      "valor": 99.0,
      "unidade": "m",
      "criado_em": "2020-01-01T00:00:00.0"
    }
  ]
  """
  before, after = fetch_data_filters(request)

  response_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, sensor_id__tipo=Sensor.NIVEL_AGUA, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  return json_success_response(data = response_data)

# Tensão da Bateria ao Longo do Tempo
@api_interface
def voltagem_bateria(request, num_serie_dispositivo):
  """
  Retorna todas as medições de voltagem da bateria no range especificado:
  [
    {
      "valor": 12.0,
      "unidade": "V",
      "criado_em": "2020-01-01T00:00:00.0"
    }
  ]
  """
  before, after = fetch_data_filters(request)

  response_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, sensor_id__tipo=Sensor.VOLTAGEM, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  return json_success_response(data = response_data)

# Comparação de Níveis de Água entre Unidades
# Barras Comparativas
# Unidades
# Nível (médio)
# Dados de nível de diferentes unidades
# Diferença de altura entre unidades
@api_interface
def nivel_agua_multiplas_unidades(request, num_serie_dispositivo):
  """
  Retorna todas as medições de nível d'água no range especificado na boia em várias unidades de medida:
  [
    {
      "valores": [
        {
          "valor": 99.0,
          "unidade": "L"
        },
        {
          "valor": 99.0,
          "unidade": "mL"
        },
        {
          "valor": 99.0,
          "unidade": "m3"
        },
        {
          "valor": 99.0,
          "unidade": "gal"
        }
      ],
      "criado_em": "2020-01-01T00:00:00.0"
    }
  ]
  """
  before, after = fetch_data_filters(request)

  pre_response_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, sensor_id__tipo=Sensor.NIVEL_AGUA, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  response_data = []
  for item in pre_response_data:
    response_data.append(
      {
        'valores': [
          { 'valor': item['valor'], 'unidade': 'L' },
          { 'valor': float(item['valor']) * 1000.0, 'unidade': 'mL' },
          { 'valor': float(item['valor']) / 1000.0, 'unidade': 'm3' },
          { 'valor': float(item['valor']) / 3.78541, 'unidade': 'gal' },
        ],
        'criado_em': item['criado_em'],
      }
    )

  return json_success_response(data = response_data)

# Histograma de Frequências de pH
@api_interface
def histograma_ph(request, num_serie_dispositivo):
  """
  Retorna os dados de PH da água no intervalo de datas especificado agrupados por valor para serem usados como histograma:
  [
    {
      "valor": "14.27",
      "unidade": "pH",
      "criado_em": "2025-01-19T21:35:19.416Z",
      "dcount": 5
    },
    {
      "valor": "7.0",
      "unidade": "pH",
      "criado_em": "2025-01-19T21:35:19.416Z",
      "dcount": 2
    }
  ]
  """
  before, after = fetch_data_filters(request)

  response_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, sensor_id__tipo=Sensor.PH_AGUA, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
      .annotate(dcount=Count('valor'))
      .order_by()
  )

  return json_success_response(data = response_data)

@api_interface
def alertas_por_tipo(request, num_serie_dispositivo):
  """
  Retorna os dados de alertas agrupados pelo tipo da seguinte forma:
  [
    {
      "tipo": "AGUA",
      "quantidade": 3
    },
    {
      "tipo": "BATERIA",
      "quantidade": 2
    }
  ]
  """
  before, after = fetch_data_filters(request)

  response_data = list(
    Alerta
      .objects
      .filter(dispositivo_id__num_serie=num_serie_dispositivo, criado_em__gte=after, criado_em__lt=before)
      .values('tipo')
      .annotate(quantidade=Count('id'))
  )

  return json_success_response(data = response_data)

@api_interface
def tensao_x_vazao(request, num_serie_dispositivo):
  """
  Retorna os dados de tensão e vazão para o range de datas especificado da seguinte forma:
  {
    "dados_tensao": [
      {
        "valor": "12.00",
        "unidade": "V",
        "criado_em": "2025-01-19T22:06:58.146Z"
      }
    ],
    "dados_vazao": [
      {
        "valor": "2.00",
        "unidade": "L/min",
        "criado_em": "2025-01-19T22:07:47.550Z"
      }
    ]
  }
  """
  before, after = fetch_data_filters(request)

  tensao_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__tipo=Sensor.VOLTAGEM, sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  vazao_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__tipo=Sensor.VAZAO_AGUA, sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  response_data = {
    'dados_tensao': tensao_data,
    'dados_vazao': vazao_data
  }

  return json_success_response(data = response_data)

@api_interface
def energia_por_volume(request, num_serie_dispositivo):
  # TODO: é necessario receber os dados de corrente da bateria
  pass

@api_interface
def eventos_criticos_urgentes(request, num_serie_dispositivo):
  """
  Retorna os dados de vazão e alertas criticos (urgentes) para o range de datas especificado da seguinte forma:
  {
    "dados_vazao": [
      {
        "valor": "2.00",
        "unidade": "L/min",
        "criado_em": "2025-01-18T03:36:13.829Z"
      }
    ],
    "dados_alerta": [
      {
        "valor": "2.00",
        "unidade": "L/min",
        "criado_em": "2025-01-19T22:07:47.550Z"
      }
    ]
  }
  """
  before, after = fetch_data_filters(request)

  vazao_data = list(
    DadosSensor
      .objects
      .filter(sensor_id__tipo=Sensor.VAZAO_AGUA, sensor_id__dispositivo_id__num_serie=num_serie_dispositivo, criado_em__gte=after, criado_em__lt=before)
      .values('valor', 'unidade', 'criado_em')
  )

  alertas_criticos_data = list(
    Alerta
      .objects
      .filter(prioridade='Urgente', dispositivo_id__num_serie=num_serie_dispositivo, criado_em__gte=after, criado_em__lt=before)
      .values('tipo', 'descricao', 'criado_em')
  )

  response_data = {
    'dados_vazao': vazao_data,
    'dados_alerta': alertas_criticos_data
  }

  return json_success_response(data = response_data)

@api_interface
def consumo_agua_x_energia(request):
  # TODO: é necessario receber os dados de corrente da bateria
  pass

class UsuariosView(generics.ListCreateAPIView):
  queryset = Usuario.objects.all()
  serializer_class = UsuarioSerializer

class UsuarioView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_object(self):
        # Obtém o valor de 'auth_id' da URL (se você estiver usando o URL como 'usuario/<int:auth_id>/')
        auth_id = self.kwargs['auth_id']
        # Busca o usuário com base no 'auth_id' (chave estrangeira)
        usuario = get_object_or_404(Usuario, auth_id=auth_id)
        # Retorna o objeto 'Usuario'
        return usuario

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
  serializer_class = AlertaSerializer

class ConsumosView(generics.ListCreateAPIView):
  queryset = Consumo.objects.all()
  serializer_class = ConsumoSerializer

class ConsumoView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Consumo.objects.all()
  serializer_class = ConsumoSerializer
