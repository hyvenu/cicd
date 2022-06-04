from django import forms
from django.contrib import admin

# Register your models here.
from django.contrib.admin import ModelAdmin

from inventory.models import ProductCategory, ProductSubCategory, ProductBrandMaster, ProductMaster, ProductPriceMaster, \
    ProductImages, ProductStock
from vendor.models import VendorMaster


from sales.service import OrderService


def update_stock_from_grn(modeladmin, request, queryset):
    order_service_obj = OrderService()
    order_service_obj.update_stock_query()


update_stock_from_grn.short_description = 'Update Stock from GRN and Sales'

class ProductCategoryForm(ModelAdmin):
    list_display = ['category_name','category_code','description']

    class Meta:
        model = ProductCategory
        fields = '__all__'
        exclude = ['user_created', 'user_modified', 'hostname_created', 'hostname_modified',
                   'device_created', 'device_modified']

class ProductSubCategoryForm(ModelAdmin):
    list_display = ['category','sub_category_name','sub_category_code']

    class Meta:
        model = ProductSubCategory
        fields = '__all__'
        exclude = ['user_created', 'user_modified', 'hostname_created', 'hostname_modified',
                   'device_created', 'device_modified']


class ProductStockForm(forms.ModelForm):
    class Meta:
        model = ProductStock
        exclude = ['user_created', 'user_modified', 'hostname_created', 'hostname_modified',
                   'device_created', 'device_modified']


class ProductStockForm(ModelAdmin):
    list_display = ['store','product', 'unit', 'quantity', 'grn_number', 'batch_number', 'batch_expiry']
    list_filter = ['product','store','batch_number']
    search_fields = ['store','product']
    form = ProductStockForm
    actions = [update_stock_from_grn, ]

    class Meta:
        model = ProductStock
        fields = '__all__'
        exclude = ['user_created', 'user_modified', 'hostname_created', 'hostname_modified',
                   'device_created', 'device_modified']



admin.site.register(ProductCategory,ProductCategoryForm)
admin.site.register(ProductSubCategory,ProductSubCategoryForm)
admin.site.register(ProductBrandMaster)
admin.site.register(ProductMaster)
admin.site.register(ProductPriceMaster)
admin.site.register(ProductImages)
admin.site.register(VendorMaster)
admin.site.register(ProductStock,ProductStockForm)