from django.contrib import admin

# Register your models here.
from store.models import StoreUser, Store, Department, ProductCampaigns

admin.site.register(Store)
admin.site.register(StoreUser)
admin.site.register(Department)
admin.site.register(ProductCampaigns)