from django.db import models
from django.urls import reverse
from audit_fields.models import AuditUuidModelMixin

class ReportEngineModel(AuditUuidModelMixin):
    report_name = models.CharField(max_length=250, unique=True)
    sql_query = models.TextField()
    is_active = models.BooleanField(default=True)
    report_main_header = models.CharField(max_length=250,blank=True)
    report_sub_header = models.CharField(max_length=250,blank=True)
    numerical_columns = models.TextField(max_length=5000,blank=True)
    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("reportengine_reportmodel_details", args=(self.pk,))

    def get_update_url(self):
        return reverse("reportengine_reportmodel_update", args=(self.pk,))

