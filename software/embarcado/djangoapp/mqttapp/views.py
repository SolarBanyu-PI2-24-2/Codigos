from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Log
from .serializers import LogSerializer

@api_view(['GET'])
def logs_view(request):
    logs = Log.objects.order_by('-timestamp')[:50]  # Pega os últimos 50 logs
    serializer = LogSerializer(logs, many=True)
    return Response(serializer.data)
