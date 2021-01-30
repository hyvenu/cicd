# Generated by Django 3.1.1 on 2021-01-30 04:36

import _socket
import audit_fields.fields.hostname_modification_field
import audit_fields.fields.userfield
import audit_fields.fields.uuid_auto_field
import audit_fields.models.audit_model_mixin
from django.db import migrations, models
import django_revision.revision_field


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='VendorMaster',
            fields=[
                ('revision', django_revision.revision_field.RevisionField(blank=True, editable=False, help_text='System field. Git repository tag:branch:commit.', max_length=75, null=True, verbose_name='Revision')),
                ('created', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('modified', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('user_created', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user created')),
                ('user_modified', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user modified')),
                ('hostname_created', models.CharField(blank=True, default=_socket.gethostname, help_text='System field. (modified on create only)', max_length=60)),
                ('hostname_modified', audit_fields.fields.hostname_modification_field.HostnameModificationField(blank=True, help_text='System field. (modified on every save)', max_length=50)),
                ('id', audit_fields.fields.uuid_auto_field.UUIDAutoField(blank=True, editable=False, help_text='System auto field. UUID primary key.', primary_key=True, serialize=False)),
                ('vendor_code', models.CharField(max_length=30)),
                ('vendor_name', models.CharField(default='', max_length=300)),
                ('vendor_type', models.CharField(default='', max_length=100)),
                ('state_code', models.IntegerField(default=0, null=True)),
                ('state_name', models.CharField(default='', max_length=50)),
                ('region', models.CharField(default='', max_length=30)),
                ('corp_ofc_addr', models.CharField(default='', max_length=2000)),
                ('branch_ofc_addr', models.CharField(default='', max_length=2000)),
                ('postal_code', models.IntegerField(default=0, null=True)),
                ('pan_no', models.CharField(default='', max_length=10)),
                ('aadhar_no', models.CharField(default='', max_length=12)),
                ('gst_no', models.CharField(default='', max_length=15)),
                ('poc_name', models.CharField(default='', max_length=100)),
                ('designation', models.CharField(default='', max_length=50)),
                ('mobile_no', models.CharField(default='', max_length=15)),
                ('land_line_no', models.CharField(default='', max_length=14)),
                ('email_id', models.CharField(default='', max_length=50)),
                ('alternative', models.CharField(default='', max_length=50)),
                ('bank_name', models.CharField(default='', max_length=100)),
                ('ifsc_code', models.CharField(default='', max_length=11)),
                ('micr_code', models.CharField(default='', max_length=9)),
                ('account_no', models.CharField(default='', max_length=30)),
                ('beneficiary_name', models.CharField(default='', max_length=100)),
                ('payment_terms', models.CharField(default='', max_length=100)),
                ('credit_days', models.CharField(default='', max_length=100)),
                ('approved_transporter', models.CharField(default='', max_length=100)),
                ('tds_applicable', models.CharField(default='', max_length=100)),
                ('account_type', models.CharField(default='', max_length=100)),
                ('dedcutee_type', models.CharField(default='', max_length=100)),
                ('pan_doc', models.ImageField(blank=True, default=None, null=True, upload_to='static/upload/vendor/pan_doc')),
                ('gst_doc', models.ImageField(blank=True, default=None, null=True, upload_to='static/upload/vendor/gst_doc')),
            ],
        ),
    ]
