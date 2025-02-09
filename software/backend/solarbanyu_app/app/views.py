from django.utils.decorators import method_decorator 
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, EnderecoSerializer, DispositivoSerializer, SensorSerializer, DadoSensorSerializer, AlertaSerializer, ConsumoSerializer
from .models import Endereco, Dispositivo, Sensor, DadoSensor, Alerta, Consumo

User = get_user_model()

@method_decorator(csrf_exempt, name="dispatch") 
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=email, password=password)
        
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user_id": user.id}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credenciais inválidas"}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()  # Remove o token do usuário
            return Response({"message": "Logout realizado com sucesso"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Usuário criado com sucesso!", "user_id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"message": "Usuário deletado com sucesso!"}, status=status.HTTP_204_NO_CONTENT)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Apenas usuários autenticados podem acessar

    def get(self, request):
        user = request.user  # Obtém o usuário logado
        return Response({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "profissao": user.profissao,
            "email": user.email,
        })

class AddressCreateView(APIView):
    """Cria um endereço para o usuário logado."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data["usuario"] = request.user.id  # Associa o endereço ao usuário logado
        serializer = EnderecoSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressUpdateView(APIView):
    """Edita um endereço existente do usuário logado."""
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        try:
            endereco = Endereco.objects.get(id=id, usuario=request.user)
        except Endereco.DoesNotExist:
            return Response({"error": "Endereço não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EnderecoSerializer(endereco, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressRetrieveView(APIView):
    """Retorna o endereço do usuário logado."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            endereco = Endereco.objects.get(usuario=request.user)
            serializer = EnderecoSerializer(endereco)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Endereco.DoesNotExist:
            return Response({"error": "Endereço não encontrado"}, status=status.HTTP_404_NOT_FOUND)

class DispositivoCreateView(APIView):
    """Cria um novo dispositivo associado ao usuário logado."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data["usuario"] = request.user.id  # Associa o dispositivo ao usuário logado
        serializer = DispositivoSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DispositivoUpdateView(APIView):
    """Edita um dispositivo existente do usuário logado."""
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        try:
            dispositivo = Dispositivo.objects.get(id=id, usuario=request.user)
        except Dispositivo.DoesNotExist:
            return Response({"error": "Dispositivo não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DispositivoSerializer(dispositivo, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DispositivoListView(APIView):
    """Lista todos os dispositivos do usuário logado."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        dispositivos = Dispositivo.objects.filter(usuario=request.user)
        serializer = DispositivoSerializer(dispositivos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SensorCreateListView(APIView):
    """Cria e lista sensores do usuário logado."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SensorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        sensores = Sensor.objects.filter(dispositivo__usuario=request.user)
        serializer = SensorSerializer(sensores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DadoSensorCreateListView(APIView):
    """Cria e lista dados dos sensores do usuário logado."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DadoSensorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        dados_sensores = DadoSensor.objects.filter(sensor__dispositivo__usuario=request.user)
        serializer = DadoSensorSerializer(dados_sensores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DadoSensorListBySensorView(APIView):
    """Lista todos os dados de um sensor específico do usuário logado."""
    permission_classes = [IsAuthenticated]

    def get(self, request, sensor_id):
        try:
            # Verifica se o sensor pertence a um dispositivo do usuário logado
            sensor = Sensor.objects.get(id=sensor_id, dispositivo__usuario=request.user)
        except Sensor.DoesNotExist:
            return Response({"error": "Sensor não encontrado ou não pertence a você."}, status=status.HTTP_404_NOT_FOUND)

        # Busca os dados relacionados a esse sensor
        dados_sensores = DadoSensor.objects.filter(sensor=sensor)
        serializer = DadoSensorSerializer(dados_sensores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConsumoCreateListView(APIView):
    """Cria e lista dados de consumo do usuário logado."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ConsumoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        consumos = Consumo.objects.filter(dispositivo__usuario=request.user)
        serializer = ConsumoSerializer(consumos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AlertaCreateListView(APIView):
    """Cria e lista alertas do usuário logado."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AlertaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        alertas = Alerta.objects.filter(dispositivo__usuario=request.user)
        serializer = AlertaSerializer(alertas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
