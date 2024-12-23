# Generated by Django 5.1.4 on 2024-12-23 00:39

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Dispositivo',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('modelo', models.CharField(max_length=255)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('ativo', models.BooleanField(default=True)),
                ('data_instalacao', models.DateTimeField()),
                ('capacidade', models.FloatField()),
                ('num_serie', models.CharField(max_length=100)),
                ('data_filtro', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Endereco',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('cep', models.CharField(max_length=8)),
                ('rua', models.CharField(max_length=255)),
                ('numero', models.CharField(max_length=10)),
                ('complemento', models.CharField(max_length=255, null=True)),
                ('cidade', models.CharField(max_length=100)),
                ('estado', models.CharField(max_length=2)),
            ],
        ),
        migrations.CreateModel(
            name='TipoSensor',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=255)),
                ('descricao', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255, unique=True)),
                ('senha', models.CharField(max_length=255)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('ativo', models.BooleanField(default=True)),
                ('tipo_usuario', models.CharField(max_length=50)),
                ('profissao', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Consumo',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('atualizado_em', models.DateTimeField(auto_now=True, null=True)),
                ('dispositivo_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.dispositivo')),
            ],
        ),
        migrations.CreateModel(
            name='Alerta',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('tipo', models.CharField(max_length=50)),
                ('descricao', models.TextField()),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('atualizado_em', models.DateTimeField(auto_now=True, null=True)),
                ('resolvido', models.BooleanField(default=False)),
                ('prioridade', models.CharField(choices=[('Urgente', 'Urgente'), ('Rotina', 'Rotina'), ('Média', 'Média'), ('Baixa', 'Baixa')], max_length=20)),
                ('dispositivo_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.dispositivo')),
            ],
        ),
        migrations.AddField(
            model_name='dispositivo',
            name='endereco_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.endereco'),
        ),
        migrations.CreateModel(
            name='Sensor',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('tipo', models.CharField(max_length=50)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('ativo', models.BooleanField(default=True)),
                ('dispositivo_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.dispositivo')),
                ('tipo_sensor_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.tiposensor')),
            ],
        ),
        migrations.CreateModel(
            name='DadosSensor',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('unidade', models.CharField(max_length=50)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('sensor_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.sensor')),
            ],
        ),
        migrations.AddField(
            model_name='dispositivo',
            name='usuario_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.usuario'),
        ),
    ]
