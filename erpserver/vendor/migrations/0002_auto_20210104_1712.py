# Generated by Django 3.1.1 on 2021-01-04 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vendor', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vendormaster',
            name='region',
            field=models.CharField(default='', max_length=30),
        ),
        migrations.AlterField(
            model_name='vendormaster',
            name='state_name',
            field=models.CharField(default='', max_length=50),
        ),
        migrations.AlterField(
            model_name='vendormaster',
            name='vendor_name',
            field=models.CharField(default='', max_length=300),
        ),
        migrations.AlterField(
            model_name='vendormaster',
            name='vendor_type',
            field=models.CharField(default='', max_length=100),
        ),
    ]
