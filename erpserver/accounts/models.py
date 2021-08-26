from django.db import models

# Create your models here.
from audit_fields.models import AuditUuidModelMixin


class Groups(AuditUuidModelMixin):
    group_name = models.CharField(max_length=1000)
    category = models.CharField(max_length=100)

    def __str__(self):
        return  self.group_name


class SubGroups(AuditUuidModelMixin):
    sub_group_name = models.CharField(max_length=1000)
    category = models.ForeignKey(Groups,on_delete=models.CASCADE(),default="")

    def __str__(self):
        return  self.group_name


class TdsSection(AuditUuidModelMixin):
    # ref_no = models.CharField(max_length=255,null=True)
    section_number = models.CharField(max_length=255)
    source = models.CharField(max_length=255)
    payee_type = models.CharField(max_length=255)
    thershold_limit = models.DecimalField(max_digits=10,decimal_places=2)
    tds_rate = models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return self.section_number

