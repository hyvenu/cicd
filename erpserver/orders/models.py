from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
from viewflow.models import Process

from audit_fields.models import AuditUuidModelMixin
from inventory.models import ProductMaster, ProductPriceMaster

User = get_user_model()


class OrderRequest(AuditUuidModelMixin):
    order_raised_date = models.DateTimeField(null=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    order_status = models.IntegerField(null=True)

    class Meta:
        pass

    def __str__(self):
        return self.pk + '/' + self.customer + '/' + str(self.order_status)


class OrderDetails(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductMaster,on_delete=models.CASCADE)
    pack_type = models.ForeignKey(ProductPriceMaster, on_delete=models.CASCADE)
    unit_price = models.DecimalField(max_digits=10,decimal_places=2)
    quantity = models.IntegerField(default=0)

    class Meta:
        pass









