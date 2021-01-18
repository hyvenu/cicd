from django.db import models

# Create your models here.

from django.core.validators import RegexValidator
from django.db import models
from audit_fields.models import AuditUuidModelMixin
from inventory.models import ProductMaster, ProductPriceMaster, UnitMaster
from store.models import Store, Department


class PurchaseRequisition(AuditUuidModelMixin):
    pr_no = models.CharField(max_length=50)
    pr_date = models.DateField()
    created_user = models.CharField(max_length=100)
    dept = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="department")
    status = models.CharField(max_length=50, null=True)
    approved_by = models.CharField(max_length=50, null=True)
    approved_date = models.DateField(null=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.pr_no) + "-" + str(self.pr_date)


class PurchaseRequisitionProductList(AuditUuidModelMixin):
    pr_no_rf = models.ForeignKey(PurchaseRequisition, on_delete=models.CASCADE, related_name="purchase_requisition")
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, null=True, related_name="pr_product")
    product_code = models.CharField(max_length=30, null=True)
    product_name = models.CharField(max_length=30, null=True)
    description = models.CharField(max_length=100, default='')
    store = models.CharField(max_length=50, null=True)
    # store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="store_pr")
    required_qty = models.IntegerField(null=True, default=0)
    unit = models.ForeignKey(UnitMaster, on_delete=models.CASCADE, related_name="purchase_requisition_unit")
    expected_date = models.DateField(null=True)
    active = models.BooleanField(default=True)

    class Meta:
        pass

