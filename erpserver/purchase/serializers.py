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
            'finished_qty',
            'purchase_price',
            'total_price',
            'unit',
            'expected_date',
            'active'
        ]


class POOrderRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.POOrderRequest
        fields = [
            'id',
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
            'po_order',
        ]




class GRNMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GRNMaster
        fields = [
            'id',
            'grn_code',
            'grn_date',
            'grn_status',
            'po_number',
            'invoice_number',
            'invoice_date',
            'vendor',
            'vendor_code',
            'vendor_name',
            'vendor_address',
            'vehicle_number',
            'time_in',
            'time_out',
            'transporter_name',
            'statutory_details',
            'note',
            'sub_total',
            'grand_total',
            'invoice_doc',
            'sgst',
            'cgst',
            'igst',
        ]


class GRNProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GRNProductList
        fields = [
            'id',
            'grn',
            'product',
            'product_code',
            'product_name',
            'description',
            'hsn_code',
            'amount',
            'po_qty',
            'received_qty',
            'rejected_qty',
            'accepted_qty',
            'unit_id',
            'unit_price',
            'gst',
            'amount',
            'gst_amount',
            'total',
            'batch_code',
            'expiry_date',
        ]
