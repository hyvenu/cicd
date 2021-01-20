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
            'pr_no_rf',
            'product',
            'product_code',
            'product_name',
            'description',
            'store',
            'required_qty',
            'unit',
            'expected_date',
        ]


class POOrderRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.POOrderRequest
        fields = [
            'po_type',
            'po_number',
            'shipping_address',
            'transport_type',
            'vendor',
            'payment_terms',
            'other_reference',
            'terms_of_delivery',
            'note',
            'sub_total',
            'packing_perct',
            'packing_amount',
            'total_amount',
            'sgst',
            'cgst',
            'igst',
            'invoice_amount',
            'terms_conditions',
        ]
