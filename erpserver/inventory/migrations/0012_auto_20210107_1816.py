# Generated by Django 3.1.1 on 2021-01-07 18:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0011_auto_20210106_1702'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productstock',
            name='batch_expiry',
            field=models.DateField(default=datetime.datetime(2021, 1, 7, 18, 16, 0, 677331), null=True),
        ),
    ]