from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
# Create your models here.
from viewflow.models import Process

from audit_fields.models import AuditUuidModelMixin
from inventory.models import ProductMaster, ProductPriceMaster
from security.models import CustomerAddress

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

    class Meta:
        pass

    def __str__(self):
        return self.pk + '/' + self.customer + '/' + str(self.order_status)


class OrderDetails(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE)
    pack_unit = models.ForeignKey(ProductPriceMaster, on_delete=models.CASCADE)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        pass


class OrderEvents(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE)
    event_date = models.DateTimeField(null=True,blank=True)
    order_status = models.IntegerField(default=0, null=True)
    description = models.CharField(max_length=2000,null=True,default=None)

    class Meta:
        pass
