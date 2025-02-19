from django.shortcuts import render
from django.http import JsonResponse
from .mqtt_client import mqtt_logs
from rest_framework.decorators import api_view
from rest_framework.response import Response

def logs_page(request):
    return render(request, "logs.html", {'logs': mqtt_logs})


# def get_logs(request):
#     return JsonResponse({'logs': mqtt_logs})

@api_view(['GET'])
def get_logs(request):
    return JsonResponse({'logs': mqtt_logs})
