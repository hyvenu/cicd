# Generated by Django 3.1.1 on 2021-01-21 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('purchase', '0011_poorderdetails_po_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='poorderrequest',
            name='pr_number',
            field=models.CharField(default=None, max_length=50, null=True),
        ),
    ]