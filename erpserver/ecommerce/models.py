from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
from audit_fields.models import AuditUuidModelMixin
from inventory.models import ProductMaster

User = get_user_model()


class Cart(AuditUuidModelMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE)
    qty = models.IntegerField(null=True, default=0)
    sub_total = models.IntegerField(null=True,default=0)

    class Meta:
        pass


