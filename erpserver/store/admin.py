from django.contrib import admin

# Register your models here.
from django.contrib.admin import ModelAdmin

from store.models import StoreUser, Store, StoreServices, Department, Designation, ProductCampaigns, Customer, Employee, AppointmentSchedule, AppointmentForMultipleService

class ProductCampaignsForm(ModelAdmin):
    list_display = ['code','type','start_time','end_time','value','max_use','use_count','min_order_amount']

    class Meta:
        model = ProductCampaigns
        fields = '__all__'
        exclude = ['user_created', 'user_modified', 'hostname_created', 'hostname_modified',
                   'device_created', 'device_modified']
admin.site.register(Store)
admin.site.register(StoreUser)
admin.site.register(StoreServices)
admin.site.register(Department)
admin.site.register(Designation)
admin.site.register(ProductCampaigns,ProductCampaignsForm)
admin.site.register(Customer)
admin.site.register(Employee)
admin.site.register(AppointmentSchedule)
admin.site.register(AppointmentForMultipleService)
