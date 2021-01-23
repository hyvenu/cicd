from django.db import models

# Create your models here.
from audit_fields.models import AuditUuidModelMixin

from django.core.validators import RegexValidator
from django.db import models
from audit_fields.models import AuditUuidModelMixin
from inventory.models import ProductMaster, ProductPriceMaster, UnitMaster
from store.models import Store, Department
from vendor.models import VendorMaster


class POOrderRequest(AuditUuidModelMixin):
    po_type = models.CharField(max_length=50)
    po_number = models.CharField(max_length=255,unique=True)
    shipping_address = models.CharField(max_length=2000, null=True)
    transport_type = models.CharField(max_length=200)
    vendor = models.ForeignKey(VendorMaster, on_delete=models.CASCADE)
    payment_terms = models.CharField(max_length=200, null=True)
    other_reference = models.CharField(max_length=2000,null=True)
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

    def __str__(self):
        return self.po_number

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

