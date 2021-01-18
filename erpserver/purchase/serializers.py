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
            'status',
            'approved_by',
            'approved_date',
        ]


class PurchaseRequisitionProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PurchaseRequisitionProductList
        fields = [
            'id'
            'pr_no_rf',
            'product',
            'product_code',
            'product_name',
            'description',
            'store',
            'required_qty',
            'unit',
            'expected_date',
            'active'
        ]
