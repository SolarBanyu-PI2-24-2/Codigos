from django.urls import path
from .views import LoginView, LogoutView, UserCreateView, UserDeleteView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', UserCreateView.as_view(), name='register'),
    path('delete/<int:pk>/', UserDeleteView.as_view(), name='delete-user'),
]