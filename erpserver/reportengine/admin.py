from django.contrib.admin import ModelAdmin
from django.contrib import admin

from .models import ReportEngineModel

class ReportMainForm(ModelAdmin):
    list_display = ["report_name","is_active", "report_main_header","report_sub_header"]

    class Meta:
        model = ReportEngineModel
        fields = '__all__'
        exclude = ['user_created', 'user_modified', 'hostname_created', 'hostname_modified',
                   'device_created', 'device_modified']


admin.site.register(ReportEngineModel,ReportMainForm)
