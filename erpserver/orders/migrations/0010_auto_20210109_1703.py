# Generated by Django 3.1.1 on 2021-01-09 17:03

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0009_auto_20210109_1655'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderevents',
            name='event_date',
            field=models.DateTimeField(default=datetime.datetime(2021, 1, 9, 17, 3, 20, 585111, tzinfo=utc)),
        ),
    ]
