# Generated by Django 3.1.1 on 2021-01-10 15:32

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderevents',
            name='event_date',
            field=models.DateTimeField(default=datetime.datetime(2021, 1, 10, 15, 32, 17, 911650, tzinfo=utc)),
        ),
    ]