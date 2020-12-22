from django.db import models

# Create your models here.
from django.urls import reverse

from audit_fields.models import AuditUuidModelMixin
from store.models import Store


class ProductCategory(AuditUuidModelMixin):

    # Fields
    category_code = models.CharField(max_length=30)
    category_name = models.CharField(max_length=300)
    description = models.CharField(max_length=2000,null=True,blank=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.category_name) + "-" + str(self.category_code)

    def get_absolute_url(self):
        return reverse("inventory_ProductCategory_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("inventory_ProductCategory_update", args=(self.pk,))


class ProductSubCategory(AuditUuidModelMixin):

    # Fields
    sub_category_name = models.CharField(max_length=50)
    sub_category_code = models.CharField(max_length=30)

    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE,related_name="category_sub_category")

    class Meta:
        pass

    def __str__(self):
        return str(self.sub_category_name)

    def get_absolute_url(self):
        return reverse("inventory_ProductSubCategory_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("inventory_ProductSubCategory_update", args=(self.pk,))


class ProductBrandMaster(AuditUuidModelMixin):

    # Fields
    brand_image = models.ImageField(upload_to="upload/product/brands", unique=True)
    brand_name = models.CharField(max_length=100)

    class Meta:
        pass

    def __str__(self):
        return str(self.brand_name)

    def get_absolute_url(self):
        return reverse("inventory_ProductBrandMaster_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("inventory_ProductBrandMaster_update", args=(self.pk,))


class UnitMaster(AuditUuidModelMixin):

    # Fields
    PrimaryUnit = models.CharField(max_length=100)
    SecondaryUnit = models.CharField(max_length=300)

    class Meta:
        pass

    def __str__(self):
        return str(self.PrimaryUnit) + "-" + str(self.SecondaryUnit)

    def get_absolute_url(self):
        return reverse("inventory_UnitMaster_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("inventory_UnitMaster_update", args=(self.pk,))


class ProductMaster(AuditUuidModelMixin):

    # Fields
    hsn_code = models.CharField(max_length=30)
    product_code = models.CharField(max_length=30)
    product_image = models.ImageField(upload_to="upload/product/products", unique=True)
    description = models.CharField(max_length=2000)
    product_name = models.CharField(max_length=30)

    category = models.ForeignKey(ProductCategory,on_delete=models.CASCADE, related_name="product_category")
    sub_category = models.ForeignKey(ProductSubCategory,on_delete=models.CASCADE, related_name="product_sub_category")
    brand = models.ForeignKey(ProductBrandMaster, on_delete=models.CASCADE, related_name="product_brand", null=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.product_code) + " / " + str(self.product_name)

    def get_absolute_url(self):
        return reverse("inventory_ProductMaster_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("inventory_ProductMaster_update", args=(self.pk,))


class ProductPriceMaster(AuditUuidModelMixin):
    # Fields

    primaryunit_price_buy = models.DecimalField(max_digits=10, decimal_places=2)
    primaryunit_price_sell = models.DecimalField(max_digits=10, decimal_places=2)
    secondaryunit_price_sell = models.DecimalField(max_digits=10, decimal_places=2)
    secondaryunit_price_buy = models.DecimalField(max_digits=10, decimal_places=2)

    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, related_name="product_product_master")
    unit = models.ForeignKey(UnitMaster, on_delete=models.CASCADE, related_name="product_unit_master")
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    batch_number = models.CharField(max_length=30,null=True,blank=True)
    batch_expiry = models.DateField(null=True)

    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="store_product", null=True)
    ob_qty = models.IntegerField(default=0,null=True)

    class Meta:
        pass

    def __str__(self):
        return '%d: %s' % (self.product, self.primaryunit_price_sell)

    def get_absolute_url(self):
        return reverse("inventory_ProductPriceMaster_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("inventory_ProductPriceMaster_update", args=(self.pk,))

