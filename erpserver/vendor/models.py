from django.core.validators import RegexValidator
from django.db import models
from audit_fields.models import AuditUuidModelMixin


# Create your models here.
class VendorMaster(AuditUuidModelMixin):
    vendor_code = models.CharField(max_length=30)
    vendor_name = models.CharField(max_length=300, default="")
    vendor_type = models.CharField(max_length=100, default="")
    state_code = models.IntegerField(null=True, default=0)
    #state_name = models.CharField(max_length=50, default="")
    #region = models.CharField(max_length=30, default="")
    #corp_ofc_addr = models.CharField(max_length=2000, default="")
    branch_ofc_addr = models.CharField(max_length=2000, default="")
    # postal_code = models.IntegerField(null=True, default=0)
    # pan_no = models.CharField(max_length=10, default="")
    # aadhar_no = models.CharField(max_length=12, default="")
    gst_no = models.CharField(max_length=15, default="")
    # poc_name = models.CharField(max_length=100, default="")
    # designation = models.CharField(max_length=50, default="")
    mobile_no = models.CharField(max_length=15, default="")
    #land_line_no = models.CharField(max_length=14, default="")
    email_id = models.CharField(max_length=50, default="")
    # alternative = models.CharField(max_length=50, default="")
    # bank_name = models.CharField(max_length=100, default="")
    # ifsc_code = models.CharField(max_length=11, default="")
    # micr_code = models.CharField(max_length=9, default="")
    # account_no = models.CharField(max_length=30, default="")
    # beneficiary_name = models.CharField(max_length=100, default="")
    # payment_terms = models.CharField(max_length=100, default="")
    # credit_days = models.CharField(max_length=100, default="")
    # approved_transporter = models.CharField(max_length=100, default="")
    # tds_applicable = models.CharField(max_length=100, default="")
    # account_type = models.CharField(max_length=100, default="")
    # dedcutee_type = models.CharField(max_length=100, default="")
    # pan_doc = models.ImageField(upload_to="static/upload/vendor/pan_doc", null=True, blank=True, default=None)
    # gst_doc = models.ImageField(upload_to="static/upload/vendor/gst_doc", null=True, blank=True, default=None)

    class Meta:
        pass

    def __str__(self):
        return str(self.vendor_code + "/" + str(self.vendor_name))
