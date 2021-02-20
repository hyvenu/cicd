# Generated by Django 3.1.1 on 2021-01-29 17:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('sales', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('engine', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='customer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='transaction',
            name='payment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engine.payments'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='sales_order',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='pay_order', to='sales.orderrequest'),
        ),
    ]