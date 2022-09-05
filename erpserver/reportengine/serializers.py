from rest_framework import serializers
from sequences import get_next_value

from . import models


# This Serializer for POST method i.e; to store new values , so all fields present.
class ReportDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ReportEngineModel
        fields = [
            "id",
            "report_name",
            "sql_query",
            "is_active",
            "report_main_header",
            "report_sub_header",
            "numerical_columns",
        ]


# This Serializer for Get method .Here SQL_QUERY is not displayed.
class ReportDataSerializer2(ReportDataSerializer):
    class Meta:
        model = models.ReportEngineModel
        fields = ["id",
                  "report_name",
                  "is_active",
                  "report_main_header",
                  "report_sub_header", ]
