# Generated by Django 3.1.1 on 2021-01-09 06:34

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0015_auto_20210109_0624'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productstock',
            name='batch_expiry',
            field=models.DateField(default=datetime.datetime(2021, 1, 9, 6, 34, 58, 414626), null=True),
        ),
    ]