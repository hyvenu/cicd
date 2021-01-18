# Generated by Django 3.1.1 on 2021-01-10 16:08

import _socket
import audit_fields.fields.hostname_modification_field
import audit_fields.fields.userfield
import audit_fields.fields.uuid_auto_field
import audit_fields.models.audit_model_mixin
from django.db import migrations, models
import django.db.models.deletion
import django_revision.revision_field


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0022_auto_20210110_1608'),
        ('store', '0004_auto_20210109_1547'),
        ('purchase', '0002_purchaserequisition_dept'),
    ]

    operations = [
        migrations.CreateModel(
            name='PurchaseRequisitionProductList',
            fields=[
                ('revision', django_revision.revision_field.RevisionField(blank=True, editable=False, help_text='System field. Git repository tag:branch:commit.', max_length=75, null=True, verbose_name='Revision')),
                ('created', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('modified', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('user_created', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user created')),
                ('user_modified', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user modified')),
                ('hostname_created', models.CharField(blank=True, default=_socket.gethostname, help_text='System field. (modified on create only)', max_length=60)),
                ('hostname_modified', audit_fields.fields.hostname_modification_field.HostnameModificationField(blank=True, help_text='System field. (modified on every save)', max_length=50)),
                ('id', audit_fields.fields.uuid_auto_field.UUIDAutoField(blank=True, editable=False, help_text='System auto field. UUID primary key.', primary_key=True, serialize=False)),
                ('product_name', models.CharField(max_length=30)),
                ('description', models.CharField(default='', max_length=100)),
                ('required_qty', models.ImageField(default=0, null=True, upload_to='')),
                ('expected_date', models.DateField()),
                ('pr_no_rf', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchase_requisition', to='purchase.purchaserequisition')),
                ('store', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='store_pr', to='store.store')),
                ('unit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchase_requisition_unit', to='inventory.productpricemaster')),
            ],
        ),
        migrations.DeleteModel(
            name='ProductRequisitionList',
        ),
    ]
