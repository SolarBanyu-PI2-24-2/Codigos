from django.shortcuts import render

from .mqtt_client import mqtt_logs

def logs_page(request):
    return render(request, "logs.html", {'logs': mqtt_logs})
