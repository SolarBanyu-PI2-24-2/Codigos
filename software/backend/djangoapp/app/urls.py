from django.urls import path, re_path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('usuarios/', views.UsuariosView.as_view(), name='usuarios_view'),
    path('usuario/<uuid:pk>/', views.UsuarioView.as_view(), name='usuario_view'),
    path('enderecos/', views.EnderecosView.as_view(), name='enderecos_view'),
    path('endereco/<uuid:pk>/', views.EnderecoView.as_view(), name='endereco_view'),
    path('dispositivos/', views.DispositivosView.as_view(), name='dispositivos_view'),
    path('dispositivo/<uuid:pk>/', views.DispositivoView.as_view(), name='dispositivo_view'),
    path('sensores/', views.SensoresView.as_view(), name='sensores_view'),
    path('sensor/<uuid:pk>/', views.SensorView.as_view(), name='sensor_view'),
    path('dados_sensores/', views.DadosSensoresView.as_view(), name='dados_sensores_view'),
    path('dados_sensor/<uuid:pk>/', views.DadosSensorView.as_view(), name='dados_sensor_view'),
    path('alertas/', views.AlertasView.as_view(), name='alertas_view'),
    path('alerta/<uuid:pk>/', views.AlertaView.as_view(), name='alerta_view'),
    path('consumos/', views.ConsumosView.as_view(), name='consumos_view'),
    path('consumo/<uuid:pk>/', views.ConsumoView.as_view(), name='consumo_view'),
]
