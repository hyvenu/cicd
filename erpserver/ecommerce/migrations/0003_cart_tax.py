# Generated by Django 3.1.1 on 2021-01-06 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0002_auto_20201230_0813'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='tax',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]