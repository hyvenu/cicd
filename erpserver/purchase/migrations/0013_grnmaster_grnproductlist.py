# Generated by Django 3.1.1 on 2021-01-26 16:13

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
        ('inventory', '0021_productsubcategory_description'),
        ('vendor', '0001_initial'),
        ('purchase', '0012_poorderrequest_pr_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='GRNMaster',
            fields=[
                ('revision', django_revision.revision_field.RevisionField(blank=True, editable=False, help_text='System field. Git repository tag:branch:commit.', max_length=75, null=True, verbose_name='Revision')),
                ('created', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('modified', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('user_created', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user created')),
                ('user_modified', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user modified')),
                ('hostname_created', models.CharField(blank=True, default=_socket.gethostname, help_text='System field. (modified on create only)', max_length=60)),
                ('hostname_modified', audit_fields.fields.hostname_modification_field.HostnameModificationField(blank=True, help_text='System field. (modified on every save)', max_length=50)),
                ('id', audit_fields.fields.uuid_auto_field.UUIDAutoField(blank=True, editable=False, help_text='System auto field. UUID primary key.', primary_key=True, serialize=False)),
                ('grn_code', models.CharField(max_length=50)),
                ('grn_date', models.DateField(null=True)),
                ('grn_status', models.CharField(default=None, max_length=50, null=True)),
                ('po_number', models.CharField(default=None, max_length=50, null=True)),
                ('invoice_number', models.CharField(default=None, max_length=50, null=True)),
                ('invoice_date', models.DateField(null=True)),
                ('vendor_code', models.CharField(default=None, max_length=50, null=True)),
                ('vendor_name', models.CharField(default=None, max_length=100, null=True)),
                ('vendor_address', models.CharField(default='', max_length=2000)),
                ('vehicle_number', models.CharField(default=None, max_length=50, null=True)),
                ('time_in', models.CharField(default=None, max_length=50, null=True)),
                ('time_out', models.CharField(default=None, max_length=50, null=True)),
                ('transporter_name', models.CharField(default=None, max_length=100, null=True)),
                ('statutory_details', models.CharField(default=None, max_length=50, null=True)),
                ('note', models.CharField(default=None, max_length=200, null=True)),
                ('sub_total', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('grand_total', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('vendor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vendor.vendormaster')),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GRNProductList',
            fields=[
                ('revision', django_revision.revision_field.RevisionField(blank=True, editable=False, help_text='System field. Git repository tag:branch:commit.', max_length=75, null=True, verbose_name='Revision')),
                ('created', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('modified', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('user_created', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user created')),
                ('user_modified', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user modified')),
                ('hostname_created', models.CharField(blank=True, default=_socket.gethostname, help_text='System field. (modified on create only)', max_length=60)),
                ('hostname_modified', audit_fields.fields.hostname_modification_field.HostnameModificationField(blank=True, help_text='System field. (modified on every save)', max_length=50)),
                ('id', audit_fields.fields.uuid_auto_field.UUIDAutoField(blank=True, editable=False, help_text='System auto field. UUID primary key.', primary_key=True, serialize=False)),
                ('product_code', models.CharField(max_length=30, null=True)),
                ('product_name', models.CharField(max_length=30, null=True)),
                ('description', models.CharField(max_length=100, null=True)),
                ('hsn_code', models.CharField(max_length=30, null=True)),
                ('po_qty', models.IntegerField()),
                ('received_qty', models.IntegerField()),
                ('rejected_qty', models.IntegerField()),
                ('accepted_qty', models.IntegerField()),
                ('unit_price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('gst', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('gst_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('total', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('grn', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grn_product_list', to='purchase.grnmaster')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grn_product', to='inventory.productmaster')),
                ('unit_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grn_unit', to='inventory.unitmaster')),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
    ]
