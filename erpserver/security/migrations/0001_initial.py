# Generated by Django 3.1.1 on 2021-01-29 17:57

import _socket
import audit_fields.fields.hostname_modification_field
import audit_fields.fields.userfield
import audit_fields.fields.uuid_auto_field
import audit_fields.models.audit_model_mixin
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_revision.revision_field


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('revision', django_revision.revision_field.RevisionField(blank=True, editable=False, help_text='System field. Git repository tag:branch:commit.', max_length=75, null=True, verbose_name='Revision')),
                ('created', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('modified', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('user_created', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user created')),
                ('user_modified', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user modified')),
                ('hostname_created', models.CharField(blank=True, default=_socket.gethostname, help_text='System field. (modified on create only)', max_length=60)),
                ('hostname_modified', audit_fields.fields.hostname_modification_field.HostnameModificationField(blank=True, help_text='System field. (modified on every save)', max_length=50)),
                ('id', audit_fields.fields.uuid_auto_field.UUIDAutoField(blank=True, editable=False, help_text='System auto field. UUID primary key.', primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=40, unique=True)),
                ('first_name', models.CharField(blank=True, max_length=30)),
                ('last_name', models.CharField(blank=True, max_length=30)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('referral_code', models.CharField(blank=True, max_length=100, null=True)),
                ('phone_number', models.CharField(default=None, max_length=100, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
                'swappable': 'AUTH_USER_MODEL',
            },
        ),
        migrations.CreateModel(
            name='CustomerAddress',
            fields=[
                ('revision', django_revision.revision_field.RevisionField(blank=True, editable=False, help_text='System field. Git repository tag:branch:commit.', max_length=75, null=True, verbose_name='Revision')),
                ('created', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('modified', models.DateTimeField(blank=True, default=audit_fields.models.audit_model_mixin.utcnow)),
                ('user_created', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user created')),
                ('user_modified', audit_fields.fields.userfield.UserField(blank=True, help_text='Updated by admin.save_model', max_length=50, verbose_name='user modified')),
                ('hostname_created', models.CharField(blank=True, default=_socket.gethostname, help_text='System field. (modified on create only)', max_length=60)),
                ('hostname_modified', audit_fields.fields.hostname_modification_field.HostnameModificationField(blank=True, help_text='System field. (modified on every save)', max_length=50)),
                ('id', audit_fields.fields.uuid_auto_field.UUIDAutoField(blank=True, editable=False, help_text='System auto field. UUID primary key.', primary_key=True, serialize=False)),
                ('address_line1', models.CharField(blank=True, max_length=2000, null=True)),
                ('address_line2', models.CharField(blank=True, max_length=2000, null=True)),
                ('city', models.CharField(blank=True, max_length=2000, null=True)),
                ('state', models.CharField(blank=True, max_length=2000, null=True)),
                ('pin_code', models.CharField(max_length=30, null=True)),
                ('phone_number', models.CharField(max_length=20, null=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer_address', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
