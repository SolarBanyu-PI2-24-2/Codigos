from django.test import TestCase
from .models import Usuario, Endereco, Dispositivo, Sensor, DadosSensor, Alerta, Consumo
import uuid

class UsuarioModelTest(TestCase):
    
    def setUp(self):
        self.usuario = Usuario.objects.create(
            nome='John Doe',
            email='johndoe@example.com',
            senha='password123',
            tipo_usuario='admin',
            profissao='engineer'
        )

    def test_usuario_creation(self):
        usuario = self.usuario
        self.assertEqual(usuario.nome, 'John Doe')
        self.assertEqual(usuario.email, 'johndoe@example.com')
        self.assertEqual(usuario.tipo_usuario, 'admin')
        self.assertEqual(usuario.profissao, 'engineer')
        self.assertTrue(usuario.ativo)  # Default is True

    def test_str_method(self):
        self.assertEqual(str(self.usuario), 'John Doe')
    
    def test_usuario_uuid(self):
        self.assertIsInstance(self.usuario.id, uuid.UUID)

class EnderecoModelTest(TestCase):
    
    def setUp(self):
        self.endereco = Endereco.objects.create(
            cep='12345678',
            rua='Main St',
            numero='100',
            complemento='Apt 101',
            cidade='Springfield',
            estado='SP'
        )
    
    def test_endereco_creation(self):
        endereco = self.endereco
        self.assertEqual(endereco.cep, '12345678')
        self.assertEqual(endereco.rua, 'Main St')
        self.assertEqual(endereco.numero, '100')
        self.assertEqual(endereco.complemento, 'Apt 101')
        self.assertEqual(endereco.cidade, 'Springfield')
        self.assertEqual(endereco.estado, 'SP')

    def test_str_method(self):
        self.assertEqual(str(self.endereco), 'Main St, 100 - Springfield')
    
    def test_endereco_uuid(self):
        self.assertIsInstance(self.endereco.id, uuid.UUID)

class DispositivoModelTest(TestCase):

    def setUp(self):
        self.usuario = Usuario.objects.create(
            nome='John Doe',
            email='johndoe@example.com',
            senha='password123',
            tipo_usuario='admin',
            profissao='engineer'
        )
        self.endereco = Endereco.objects.create(
            cep='12345678',
            rua='Main St',
            numero='100',
            complemento='Apt 101',
            cidade='Springfield',
            estado='SP'
        )
        self.dispositivo = Dispositivo.objects.create(
            num_serie='123456',
            modelo='Model X',
            data_instalacao='2022-01-01',
            capacidade=500.5,
            data_filtro='2023-01-01T00:00:00Z',
            usuario_id=self.usuario,
            endereco_id=self.endereco
        )

    def test_dispositivo_creation(self):
        dispositivo = self.dispositivo
        self.assertEqual(dispositivo.num_serie, '123456')
        self.assertEqual(dispositivo.modelo, 'Model X')
        self.assertEqual(dispositivo.capacidade, 500.5)
        self.assertEqual(dispositivo.usuario_id, self.usuario)
        self.assertEqual(dispositivo.endereco_id, self.endereco)
        self.assertTrue(dispositivo.ativo)

    def test_str_method(self):
        self.assertEqual(str(self.dispositivo), 'Model X')

class SensorModelTest(TestCase):

    def setUp(self):
        usuario_instance = Usuario.objects.create(
            nome="Usuario Teste",
            email="usuario@teste.com",
            senha="senha123",
            tipo_usuario="Tipo A",
            profissao="Profissão A"
        )

        endereco_instance = Endereco.objects.create(
            cep="12345678",
            rua="Rua Teste",
            numero="10",
            complemento="Apto 101",
            cidade="Cidade Teste",
            estado="TS"
        )

        self.dispositivo = Dispositivo.objects.create(
            num_serie='123456',
            modelo='Model X',
            data_instalacao='2022-01-01',
            capacidade=500.5,
            data_filtro='2023-01-01T00:00:00Z',
            usuario_id=usuario_instance,
            endereco_id=endereco_instance,
        )

        self.sensor = Sensor.objects.create(
            tipo=Sensor.VAZAO_AGUA,
            dispositivo_id=self.dispositivo
        )

    def test_sensor_creation(self):
        sensor = self.sensor
        self.assertEqual(sensor.tipo, Sensor.VAZAO_AGUA)
        self.assertEqual(sensor.dispositivo_id, self.dispositivo)
        self.assertTrue(sensor.ativo)

    def test_str_method(self):

        self.assertEqual(str(self.sensor), Sensor.VAZAO_AGUA)

class DadosSensorModelTest(TestCase):

    def setUp(self):
        endereco = Endereco.objects.create(
            cep='12345678',
            rua='Rua Teste',
            numero='123',
            cidade='Cidade Teste',
            estado='TS'
        )

        usuario = Usuario.objects.create(
            nome='John Doe',
            email='johndoe@example.com',
            senha='password123',
            tipo_usuario='Admin',
            profissao='Engenheiro',
        )

        dispositivo = Dispositivo.objects.create(
            num_serie='123456',
            modelo='Model X',
            data_instalacao='2022-01-01',
            capacidade=500.5,
            data_filtro='2023-01-01T00:00:00Z',
            usuario_id=usuario,
            endereco_id=endereco
        )

        self.sensor = Sensor.objects.create(
            tipo=Sensor.VAZAO_AGUA,
            dispositivo_id=dispositivo
        )

        self.dados_sensor = DadosSensor.objects.create(
            valor=10.5,
            unidade='L/s',
            sensor_id=self.sensor
        )

    def test_dados_sensor_creation(self):
        dados = self.dados_sensor
        self.assertEqual(dados.valor, 10.5)
        self.assertEqual(dados.unidade, 'L/s')
        self.assertEqual(dados.sensor_id, self.sensor)

    def test_str_method(self):
        self.assertEqual(str(self.dados_sensor), '10.5 L/s')

class AlertaModelTest(TestCase):

    def setUp(self):
        self.usuario = Usuario.objects.create(
            nome='John Doe',
            email='johndoe@example.com',
            senha='password123',
            tipo_usuario='admin',
            profissao='engineer'
        )
        self.endereco = Endereco.objects.create(
            cep='12345678',
            rua='Main St',
            numero='100',
            complemento='Apt 101',
            cidade='Springfield',
            estado='SP'
        )
        self.dispositivo = Dispositivo.objects.create(
            num_serie='123456',
            modelo='Model X',
            data_instalacao='2022-01-01',
            capacidade=500.5,
            data_filtro='2023-01-01T00:00:00Z',
            usuario_id=self.usuario,
            endereco_id=self.endereco
        )
        self.alerta = Alerta.objects.create(
            tipo='Overload',
            descricao='Device overload detected',
            resolvido=False,
            prioridade='Urgente',
            dispositivo_id=self.dispositivo
        )

    def test_alerta_creation(self):
        alerta = self.alerta
        self.assertEqual(alerta.tipo, 'Overload')
        self.assertEqual(alerta.descricao, 'Device overload detected')
        self.assertEqual(alerta.prioridade, 'Urgente')
        self.assertEqual(alerta.dispositivo_id, self.dispositivo)

    def test_str_method(self):
        self.assertEqual(str(self.alerta), 'Overload - Device overload detected')

class ConsumoModelTest(TestCase):
    def setUp(self):
        usuario_instance = Usuario.objects.create(
            nome="Usuario Exemplo",
            email="usuario@example.com",
            senha="senha123",
            tipo_usuario="Tipo Exemplo",
            profissao="Profissão Exemplo"
        )

        endereco_instance = Endereco.objects.create(
            cep="12345678",
            rua="Rua Exemplo",
            numero="123",
            complemento="Complemento Exemplo",
            cidade="Cidade Exemplo",
            estado="EX",
        )
        
        self.dispositivo = Dispositivo.objects.create(
            num_serie=str(uuid.uuid4()),
            modelo="Modelo Exemplo",
            data_instalacao="2025-02-05",
            capacidade=100.0,
            data_filtro="2025-02-05 12:00:00",
            usuario_id=usuario_instance,
            endereco_id=endereco_instance,
        )
        
        self.consumo = Consumo.objects.create(
            valor=50.5,
            dispositivo_id=self.dispositivo,
        )

    def test_consumo_creation(self):
        consumo = self.consumo
        self.assertEqual(consumo.valor, 50.5)
        self.assertEqual(consumo.dispositivo_id, self.dispositivo)

    def test_str_method(self):
        self.assertEqual(str(self.consumo), '50.5')