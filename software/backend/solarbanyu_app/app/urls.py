from django.urls import path
from .views import LoginView
from .views import LogoutView
from .views import UserCreateView
from .views import UserDeleteView
from .views import UserProfileView
from .views import AddressCreateView
from .views import AddressUpdateView
from .views import AddressRetrieveView
from .views import DispositivoCreateView
from .views import DispositivoUpdateView
from .views import DispositivoListView
from .views import SensorCreateListView
from .views import DadoSensorCreateListView
from .views import ConsumoCreateListView
from .views import AlertaCreateListView
from .views import DadoSensorListBySensorView
from .views import AlertaUpdateView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', UserCreateView.as_view(), name='register'),
    path('delete/<int:pk>/', UserDeleteView.as_view(), name='delete-user'),
    path("user/profile/", UserProfileView.as_view(), name="user-profile"),
    path("address/", AddressCreateView.as_view(), name="create-address"),
    path("address/<int:id>/", AddressUpdateView.as_view(), name="update-address"),  
    path("address/user/", AddressRetrieveView.as_view(), name="get-address"),
    path("dispositivo/", DispositivoCreateView.as_view(), name="create-dispositivo"),
    path("dispositivo/<int:id>/", DispositivoUpdateView.as_view(), name="update-dispositivo"),
    path("dispositivos/", DispositivoListView.as_view(), name="list-dispositivos"),
    path("sensores/", SensorCreateListView.as_view(), name="create-list-sensores"),
    path("dados-sensores/", DadoSensorCreateListView.as_view(), name="create-list-dados-sensores"),
    path("consumo/", ConsumoCreateListView.as_view(), name="create-list-consumo"),
    path("alertas/", AlertaCreateListView.as_view(), name="create-list-alertas"),
    path("dados-sensores/<int:sensor_id>/", DadoSensorListBySensorView.as_view(), name="list-dados-sensor"),
    path("alertas/<int:id>/", AlertaUpdateView.as_view(), name="update-alerta"),

]