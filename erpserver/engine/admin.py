from django.contrib import admin

# Register your models here.
from django.contrib.admin import ModelAdmin

from engine.models import Translation

class ProductCampaignsForm(ModelAdmin):
    list_display = ['language_code','attribute_name','primary_text','translated_text']
    search_fields = ['language_code','attribute_name','primary_text','translated_text']


    class Meta:
        model = Translation
        fields = '__all__'
        exclude = ['user_created', 'user_modified', 'hostname_created', 'hostname_modified',
                   'device_created', 'device_modified']
admin.site.register(Translation,ProductCampaignsForm)