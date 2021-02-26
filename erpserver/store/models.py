from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
from django.urls import reverse

from audit_fields.models import AuditUuidModelMixin

User = get_user_model()


class Store(AuditUuidModelMixin):
    store_name = models.CharField(max_length=255, null=False)
    address = models.TextField(max_length=500, null=False)
    city = models.CharField(max_length=100, null=True, blank=False)
    pin_code = models.CharField(max_length=10, null=True, blank=False)
    gst_no = models.CharField(max_length=50, null=True, blank=False)
    is_head_office = models.BooleanField(default=False)

    class Meta:
        pass

    def __str__(self):
        return str(self.store_name)

    def get_absolute_url(self):
        return reverse("store_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("store_update", args=(self.pk,))


class StoreUser(AuditUuidModelMixin):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="store_user")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_store")

    class Meta:
        pass


class AppSettings(AuditUuidModelMixin):
    app_key = models.CharField(max_length=50)
    app_value = models.CharField(max_length=1000)

    class Meta:
        pass


class Department(AuditUuidModelMixin):
    department_id = models.CharField(max_length=30)
    department_name = models.CharField(max_length=100)

    class Meta:
        pass


class StoreShipLocations(AuditUuidModelMixin):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="store_locations")
    pin_code = models.CharField(max_length=50, null=True)
    location_name = models.CharField(max_length=255, null=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        pass


class ProductCampaigns(AuditUuidModelMixin):
    code = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=100, null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    value = models.FloatField(null=True, blank=True,default=0)
    max_use = models.IntegerField(null=True, blank=True,default=0)
    use_count = models.IntegerField(null=True, blank=True,default=0)
    min_order_amount = models.DecimalField(max_digits=10,decimal_places=2,default=0)

    class Meta:
        pass


class SiteSettings(AuditUuidModelMixin):
    setting_Type = models.CharField(null=False,max_length=1000)
    setting_Value = models.TextField(null=False)

    class Meta:
        pass