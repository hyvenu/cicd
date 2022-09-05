from django import forms
from . import models


class StoreForm(forms.ModelForm):
    store_name = forms.CharField(max_length=255,
                                 label="Store Name",
                                 widget=forms.TextInput(attrs={"placeholder": "Store Name", "class": "form-control"}))
    address = forms.CharField(max_length=1000,
                              widget=forms.TextInput(attrs={"placeholder": "Address", "class": "form-control"}))
    city = forms.CharField(max_length=100,
                           widget=forms.TextInput(attrs={"placeholder": "City", "class": "form-control"}))
    gst_no = forms.CharField(max_length=50,
                             label="GSTIN",
                             widget=forms.TextInput(attrs={"placeholder": "GSTIN", "class": "form-control"}))
    pin_code = forms.CharField(max_length=10,
                               widget=forms.TextInput(attrs={"placeholder": "Pin Code", "class": "form-control"}),
                               label="Pin Code")

    messages = {}

    class Meta:
        model = models.Store
        fields = ['store_name', 'address', 'pin_code', 'gst_no','city', 'state_code',
            'state_name',]

    def clean(self):
        super(StoreForm, self).clean()

        pin_code = self.cleaned_data.get("pin_code")

        if len(pin_code) < 5:
            self._errors['pin_code'] = self.error_class(['length is 5 '])
        return self.cleaned_data







