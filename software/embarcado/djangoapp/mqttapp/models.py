from django.db import models

# Create your models here.

class Log(models.Model):
    mensagem = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp}: {self.mensagem}"
