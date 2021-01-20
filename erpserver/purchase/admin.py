from django.contrib import admin
from .models import PurchaseRequisition, PurchaseRequisitionProductList
# Register your models here.
admin.site.register(PurchaseRequisition)
admin.site.register(PurchaseRequisitionProductList)
