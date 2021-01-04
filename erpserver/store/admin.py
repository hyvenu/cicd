from django.contrib import admin

# Register your models here.
from store.models import StoreUser, Store

admin.site.register(Store)
admin.site.register(StoreUser)