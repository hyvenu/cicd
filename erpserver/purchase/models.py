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
    po_number = models.CharField(max_length=255, unique=True)
    pr_number = models.CharField(max_length=50, null=True, default=None)
    po_raised_by = models.CharField(max_length=500,null=True,blank=None)
    po_date = models.DateTimeField(default=None, null=True)
    shipping_address = models.CharField(max_length=2000, null=True)
    transport_type = models.CharField(max_length=200)
    vendor = models.ForeignKey(VendorMaster,default="", on_delete=models.CASCADE)
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
    store = models.ForeignKey(Store, null=True, on_delete=models.CASCADE, related_name="store_po_req")

    def __str__(self):
        return self.po_number


class PoOrderDetails(AuditUuidModelMixin):
    po_order = models.ForeignKey(POOrderRequest, on_delete=models.CASCADE, default=None)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE,default="")
    product_code = models.CharField(max_length=50, null=True, default=None)
    product_name = models.CharField(max_length=255, null=True, default=None)
    unit = models.ForeignKey(UnitMaster, on_delete=models.CASCADE,default="")
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


class PurchaseRequisition(AuditUuidModelMixin):
    pr_no = models.CharField(max_length=50)
    pr_date = models.DateField()
    created_user = models.CharField(max_length=100)
    dept = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="department",default="")
    status = models.CharField(max_length=50, null=True)
    approved_by = models.CharField(max_length=50, null=True)
    approved_date = models.DateField(null=True)
    store = models.ForeignKey(Store, null=True, on_delete=models.CASCADE,default="", related_name="store_pur_req")

    class Meta:
        pass

    def __str__(self):
        return str(self.pr_no) + "-" + str(self.pr_date)


class PurchaseRequisitionProductList(AuditUuidModelMixin):
    pr_no_rf = models.ForeignKey(PurchaseRequisition,default="", on_delete=models.CASCADE, related_name="purchase_requisition")
    product = models.ForeignKey(ProductMaster,default="", on_delete=models.CASCADE, null=True, related_name="pr_product")
    product_code = models.CharField(max_length=30, null=True)
    product_name = models.CharField(max_length=30, null=True)
    description = models.CharField(max_length=100, default='')
    store = models.CharField(max_length=50, null=True)
    store_obj = models.ForeignKey(Store, on_delete=models.CASCADE, null=True, related_name="store_pr")
    required_qty = models.IntegerField(null=True, default=0)
    unit = models.ForeignKey(UnitMaster, on_delete=models.CASCADE, default="",related_name="purchase_requisition_unit")
    expected_date = models.DateField(null=True)
    active = models.BooleanField(default=True)

    class Meta:
        pass


class GRNMaster(AuditUuidModelMixin):
    grn_code = models.CharField(max_length=50)
    grn_date = models.DateField(null=True)
    grn_status = models.CharField(max_length=50, null=True, default=None)
    po_number = models.CharField(max_length=50, null=True, default=None)
    invoice_number = models.CharField(max_length=50, null=True, default=None)
    invoice_date = models.DateField(null=True)
    vendor = models.CharField(max_length=100, null=True, default=None)
    vendor_code = models.CharField(max_length=50, null=True, default=None)
    vendor_name = models.CharField(max_length=100, null=True, default=None)
    vendor_address = models.CharField(max_length=2000, default="")
    vehicle_number = models.CharField(max_length=50, null=True, default=None)
    time_in = models.CharField(max_length=50, null=True, default=None)
    time_out = models.CharField(max_length=50, null=True, default=None)
    transporter_name = models.CharField(max_length=100, null=True, default=None)
    statutory_details = models.CharField(max_length=50, null=True, default=None)
    note = models.CharField(max_length=200, null=True, default=None)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    igst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    invoice_doc = models.ImageField(upload_to="static/upload/grn/invoice_do", null=True, blank=True, default=None)
    store =  models.ForeignKey(Store, null=True, on_delete=models.CASCADE, related_name="grn_store")


class GRNProductList(AuditUuidModelMixin):
    grn = models.ForeignKey(GRNMaster, on_delete=models.CASCADE, related_name="grn_product_list",default="")
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, related_name="grn_product",default="")
    product_code = models.CharField(max_length=30, null=True)
    product_name = models.CharField(max_length=30, null=True)
    description = models.CharField(max_length=100, null=True)
    hsn_code = models.CharField(max_length=30, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    po_qty = models.IntegerField()
    received_qty = models.IntegerField()
    rejected_qty = models.IntegerField()
    accepted_qty = models.IntegerField()
    unit_id = models.ForeignKey(UnitMaster, on_delete=models.CASCADE, related_name="grn_unit",default="")
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    batch_code = models.CharField(max_length=30, null=True)
    expiry_date = models.DateField(null=True)

