from rest_framework import serializers

from . import models


class PurchaseRequisitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PurchaseRequisition
        fields = [
            'pr_no',
            'pr_date',
            'created_user',
            'dept',
        ]


class PurchaseRequisitionProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PurchaseRequisitionProductList
        fields = [
            'pr_no_rf',
            'product_name',
            'description',
            'store_name',
            'required_qty',
            'unit',
            'expected_date',
        ]
