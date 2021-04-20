from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
# Create your models here.
# from viewflow.models import Process

from audit_fields.models import AuditUuidModelMixin
from inventory.models import ProductMaster, ProductPriceMaster, UnitMaster
from security.models import CustomerAddress
from store.models import Store, StoreServices

User = get_user_model()


class OrderRequest(AuditUuidModelMixin):
    order_raised_date = models.DateTimeField(null=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=20, unique=True, null=True)
    order_status = models.IntegerField(null=True)
    shipping_address = models.ForeignKey(CustomerAddress, on_delete=models.CASCADE, null=True,
                                         related_name="shipping_address")
    billing_address = models.ForeignKey(CustomerAddress, on_delete=models.CASCADE, null=True,
                                        related_name="billing_address")
    invoice_no = models.CharField(max_length=255, unique=True, blank=True, null=True)
    payment_method = models.CharField(max_length=50)
    delivery_method = models.CharField(max_length=50)
    order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    promo_code = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        pass

    def __str__(self):
        return self.pk + '/' + self.customer + '/' + str(self.order_status)


class OrderDetails(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE,null=True)
    pack_unit = models.ForeignKey(ProductPriceMaster, on_delete=models.CASCADE,null=True)
    service_name = models.CharField(max_length=255,null=True)
    service_id = models.CharField(max_length=255, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    batch_expiry = models.DateField(null=True,blank=True)
    batch_number = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        pass


class OrderEvents(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE)
    event_date = models.DateTimeField(null=True,blank=True)
    order_status = models.IntegerField(default=0, null=True)
    description = models.CharField(max_length=2000, null=True, default=None)

    class Meta:
        pass


class SalesOrderRequest(AuditUuidModelMixin):
    po_type = models.CharField(max_length=50)
    po_number = models.CharField(max_length=255, unique=True)
    pr_number = models.CharField(max_length=50, null=True, default=None)
    po_raised_by = models.CharField(max_length=500,null=True,blank=None)
    po_date = models.DateTimeField(default=None, null=True)
    shipping_address = models.CharField(max_length=2000, null=True)
    transport_type = models.CharField(max_length=200, null=True)
    payment_terms = models.CharField(max_length=200, null=True)
    other_reference = models.CharField(max_length=2000, null=True)
    terms_of_delivery = models.CharField(max_length=2000, null=True)
    note = models.CharField(max_length=2000, null=True)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packing_perct = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packing_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    igst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    invoice_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    terms_conditions = models.CharField(max_length=2000, null=True)
    store = models.ForeignKey(Store, null=True, on_delete=models.CASCADE, related_name="store_sales_req")

    def __str__(self):
        return self.po_number


class SalesOrderDetails(AuditUuidModelMixin):
    po_order = models.ForeignKey(SalesOrderRequest, on_delete=models.CASCADE, default=None)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, null=True)
    service = models.ForeignKey(StoreServices, on_delete=models.CASCADE, null=True)
    product_code = models.CharField(max_length=50, null=True, default=None)
    product_name = models.CharField(max_length=255, null=True, default=None)
    unit = models.ForeignKey(UnitMaster, on_delete=models.CASCADE)
    qty = models.IntegerField()
    delivery_date = models.DateField(null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    disc_percent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    disc_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    class Meta:
        pass