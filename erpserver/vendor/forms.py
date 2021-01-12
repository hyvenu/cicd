from django import forms
from vendor import models


class VendorMasterForm(forms.ModelForm):
    class Meta:
        model = models.VendorMaster
        fields = [
            'vendor_code',
            'vendor_name',
            'vendor_type',
        ]
