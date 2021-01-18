from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
from audit_fields.models import AuditUuidModelMixin
from inventory.models import ProductMaster, ProductPriceMaster

User = get_user_model()


class Cart(AuditUuidModelMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE)
    pack_unit = models.ForeignKey(ProductPriceMaster, on_delete=models.CASCADE,null=True)
    unit_price = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    qty = models.IntegerField(null=True, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sub_total = models.IntegerField(null=True, default=0)

    class Meta:
        pass


class WishList(AuditUuidModelMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wish_list")
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, related_name="wish_product")

    class Meta:
        pass