from django.contrib import admin

# Register your models here.
from django.contrib.admin import ModelAdmin

from inventory.models import ProductCategory, ProductSubCategory, ProductBrandMaster, ProductMaster, ProductPriceMaster, \
    ProductImages


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

admin.site.register(ProductCategory,ProductCategoryForm)
admin.site.register(ProductSubCategory,ProductSubCategoryForm)
admin.site.register(ProductBrandMaster)
admin.site.register(ProductMaster)
admin.site.register(ProductPriceMaster)
admin.site.register(ProductImages)