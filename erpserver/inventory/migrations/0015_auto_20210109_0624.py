# Generated by Django 3.1.1 on 2021-01-09 06:24

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0014_auto_20210109_0622'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productstock',
            name='batch_expiry',
            field=models.DateField(default=datetime.datetime(2021, 1, 9, 6, 24, 30, 162260), null=True),
        ),
    ]
