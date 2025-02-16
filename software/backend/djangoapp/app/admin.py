from django.contrib import admin

from .models import Usuario, Endereco, Dispositivo, Sensor, DadosSensor, Alerta, Consumo
# Register your models here.

admin.site.register(Usuario)
admin.site.register(Endereco)
admin.site.register(Dispositivo)
admin.site.register(Sensor)
admin.site.register(DadosSensor)
admin.site.register(Alerta)
admin.site.register(Consumo)