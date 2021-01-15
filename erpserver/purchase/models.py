from django.db import models

# Create your models here.
from audit_fields.models import AuditUuidModelMixin


class POOrderRequest(AuditUuidModelMixin):
    po_type = models.CharField(max_length=50)
    po_number = models.CharField(max_length=255,unique=True)
    shipping_address = models.CharField(max_length=2000, null=True)
    transport_type = models.CharField(max_length=200)
    vendor_code = models.CharField(max_length=200)
    vendor_address = models.CharField(max_length=2000, null=True)
    payment_terms = models.CharField(max_length=200, null=True)



