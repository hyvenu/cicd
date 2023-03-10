from rest_framework import serializers

from . import models


class VendorMasterSerializer(serializers.ModelSerializer):
    vendor_code = serializers.CharField(max_length=30, allow_blank=True)

    class Meta:
        model = models.VendorMaster
        fields = [
            "id",
            "vendor_code",
            "vendor_name",
            "vendor_type",
            "state_code",
            "state_name",
            "region",
            "vendor_email",
            "corp_ofc_addr",
            "branch_ofc_addr",
            "postal_code",
            "pan_no",
            "aadhar_no",
            "gst_no",
            "poc_name",
            "designation",
            "mobile_no",
            "mobile_num",
            "land_line_no",
            "email_id",
            "alternative",
            "payment_terms",
            "credit_days",
            "approved_transporter",
            "tds_applicable",
            "account_type",
            "dedcutee_type",
            "bank_name",
            "ifsc_code",
            "micr_code",
            "account_no",
            "beneficiary_name",
            "pan_doc",
            "adhar_doc",
            "gst_doc"
        ]
