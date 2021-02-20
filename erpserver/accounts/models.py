from django.db import models

# Create your models here.
from audit_fields.models import AuditUuidModelMixin


class Groups(AuditUuidModelMixin):
    group_name = models.CharField(max_length=1000)
    category = models.CharField(max_length=100)

    def __str__(self):
        return  self.group_name


