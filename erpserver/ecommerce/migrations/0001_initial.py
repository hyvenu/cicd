# Generated by Django 3.1.1 on 2021-01-29 17:57

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
            name='Cart',
            fields=[
                ('revision', django_revision.revision_field.RevisionField(blank=True, editable=False, help_text='System field. Git repository tag:branch:commit.', max_length=75, null=True, verbose_name='Revision')),
                ('created', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('modified', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('user_created', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user created')),
                ('user_modified', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user modified')),
                ('hostname_created', models.CharField(blank=True, default=_socket.gethostname, help_text='System field. (modified on create only)', max_length=60)),
                ('hostname_modified', audit_fields.fields.hostname_modification_field.HostnameModificationField(blank=True, help_text='System field. (modified on every save)', max_length=50)),
                ('id', audit_fields.fields.uuid_auto_field.UUIDAutoField(blank=True, editable=False, help_text='System auto field. UUID primary key.', primary_key=True, serialize=False)),
                ('unit_price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('qty', models.IntegerField(default=0, null=True)),
                ('tax', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('tax_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('sub_total', models.IntegerField(default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='WishList',
            fields=[
                ('revision', django_revision.revision_field.RevisionField(blank=True, editable=False, help_text='System field. Git repository tag:branch:commit.', max_length=75, null=True, verbose_name='Revision')),
                ('created', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('modified', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('user_created', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user created')),
                ('user_modified', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user modified')),
                ('hostname_created', models.CharField(blank=True, default=_socket.gethostname, help_text='System field. (modified on create only)', max_length=60)),
                ('hostname_modified', audit_fields.fields.hostname_modification_field.HostnameModificationField(blank=True, help_text='System field. (modified on every save)', max_length=50)),
                ('id', audit_fields.fields.uuid_auto_field.UUIDAutoField(blank=True, editable=False, help_text='System auto field. UUID primary key.', primary_key=True, serialize=False)),
            ],
        ),
    ]
