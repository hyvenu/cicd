import datetime

from django.db import models

# Create your models here.
from django.urls import reverse

from audit_fields.models import AuditUuidModelMixin
from store.models import Store


class ProductCategory(AuditUuidModelMixin):
    # Fields
    category_code = models.CharField(max_length=30, unique=True)
    category_name = models.CharField(max_length=250, unique=True)
    description = models.CharField(max_length=2000, null=True, blank=True)
    sales_margin = models.IntegerField(default=0, null=True, blank=True)

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
    sub_category_name = models.CharField(max_length=50, unique=True)
    sub_category_code = models.CharField(max_length=30, unique=True)
    sub_category_image = models.ImageField(upload_to="static/upload/products/sub_category",
                                           default="static/assets/image/no-image.jpg", null=True)

    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name="category_sub_category")

    description = models.CharField(max_length=2000, null=True)

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
    brand_image = models.ImageField(upload_to="static/upload/product/brands",
                                    default="static/assets/image/no-image.jpg", null=True)
    brand_name = models.CharField(max_length=100, unique=True)

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
    PrimaryUnit = models.CharField(max_length=100, unique=True)
    SecondaryUnit = models.CharField(max_length=250, unique=True)
    PrimaryUnitMeasurement = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SecondaryUnitMeasurement = models.DecimalField(max_digits=10, decimal_places=2, default=0)

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
    product_image = models.ImageField(upload_to="static/upload/product/products",
                                      default="static/assets/image/no-image.jpg", null=True, blank=True)
    description = models.CharField(max_length=2000)
    product_name = models.CharField(max_length=30, unique=True, null=True, blank=True)
    active = models.BooleanField(default=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name="product_category",
                                 default=None)
    sub_category = models.ForeignKey(ProductSubCategory, on_delete=models.CASCADE, related_name="product_sub_category",
                                     default=None)
    brand = models.ForeignKey(ProductBrandMaster, on_delete=models.CASCADE, related_name="product_brand", null=True,
                              default=None)
    product_attributes = models.CharField(max_length=2000, null=True, blank=True)
    product_pack_types = models.CharField(max_length=2000, null=True, blank=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.product_name) + "("+ str(self.product_code) + ")"

    def get_absolute_url(self):
        return reverse("inventory_ProductMaster_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("inventory_ProductMaster_update", args=(self.pk,))


class ProductPriceMaster(AuditUuidModelMixin):
    # Fields
    buy_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sell_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, related_name="product_price", default=None)
    unit = models.ForeignKey(UnitMaster, on_delete=models.CASCADE, related_name="product_unit_master", default=None)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    qty = models.IntegerField(default=1)
    bar_code = models.ImageField(upload_to="static/upload/product/barcodes", blank=True)
    product_identifier = models.CharField(max_length=12, default=0)
    safety_stock_level = models.IntegerField(default=0, null=True, blank=True)
    serial_number = models.CharField(max_length=50, default=0,unique=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cess_percent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cess_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    box_qty = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    ob_qty = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    ob_value = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    class Meta:
        ordering = ('product',)

    def __str__(self):
        return '%s of %d - %s Rs=%s /-' % (self.product, self.qty, self.unit, self.sell_price)

    def get_absolute_url(self):
        return reverse("inventory_ProductPriceMaster_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("inventory_ProductPriceMaster_update", args=(self.pk,))


class ProductImages(AuditUuidModelMixin):
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, related_name="product_images", default=None)
    image = models.ImageField(upload_to="static/upload/product/products", null=True, blank=True, default=None)

    def __str__(self):
        return str(self.product)

class StockAdjustment(AuditUuidModelMixin):

    product = models.ForeignKey(ProductMaster, null=True, on_delete=models.CASCADE,related_name="product_master_stockadjustment", default=None)
    product_name = models.CharField(max_length=255,  blank=True)
    date = models.DateField(null=True, blank=True)
    available_qty = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ob_qty = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    adjusted_qty = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        pass

    def __str__(self):
        return str(self.product_name) + "-" + str(self.date) + "-" + str(self.ob_qty)

    # def get_absolute_url(self):
    #     return reverse("inventory_StockAdjustment_detail", args=(self.pk,))
    #
    # def get_update_url(self):
    #     return reverse("inventory_StockAdjustment_update", args=(self.pk,))

class ProductStock(AuditUuidModelMixin):
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, related_name="product_stock")
    grn_number = models.CharField(max_length=50, default=0, blank=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    pack = models.ForeignKey(ProductPriceMaster, on_delete=models.CASCADE, null=True)
    unit = models.ForeignKey(UnitMaster, null=True, on_delete=models.CASCADE, related_name="productstock_unit_master")
    batch_number = models.CharField(max_length=255, null=True)
    batch_expiry = models.DateField(null=True, blank=True)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return str(self.product) + 'available stock at ' + str(self.store) + ' (' + str(self.quantity) + ')'
