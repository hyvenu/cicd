from django import forms

from store.models import Store
from . import models
from .models import ProductCategory, ProductSubCategory, ProductBrandMaster, ProductMaster, UnitMaster


class ProductPriceMasterForm(forms.ModelForm):
    product = forms.ModelChoiceField(ProductMaster.objects.all(),
                                      widget=forms.Select(
                                          attrs={'class': 'form-control col-sm-4',
                                                 'placeholder': ' Product',
                                                 }))

    unit = forms.ModelChoiceField(UnitMaster.objects.all(),
                                     widget=forms.Select(
                                         attrs={'class': 'form-control col-sm-4',
                                                'placeholder': ' Unit',
                                                }))

    store = forms.ModelChoiceField(Store.objects.all(),
                                  widget=forms.Select(
                                      attrs={'class': 'form-control col-sm-4',
                                             'placeholder': ' Unit',
                                             }))
    class Meta:
        model = models.ProductPriceMaster
        fields = [
            "primaryunit_price_buy",
            "primaryunit_price_sell",
            "secondaryunit_price_sell",
            "secondaryunit_price_buy",
            "product",
            "unit",
            "tax",
            "batch_number",
            "batch_expiry",
            "store",
            "ob_qty"

        ]


class ProductBrandMasterForm(forms.ModelForm):
    class Meta:
        model = models.ProductBrandMaster
        fields = [
            "brand_image",
            "brand_name",
        ]


class UnitMasterForm(forms.ModelForm):
    class Meta:
        model = models.UnitMaster
        fields = [
            "PrimaryUnit",
            "SecondaryUnit",
        ]


class ProductSubCategoryForm(forms.ModelForm):
    category = forms.ModelChoiceField(ProductCategory.objects.all(),
                                      widget=forms.Select(
                                          attrs={'class': 'form-control col-sm-4', 'placeholder': ' Product Category'}))

    class Meta:
        model = models.ProductSubCategory
        fields = [
            "sub_category_name",
            "sub_category_code",
            "category"
        ]


class ProductMasterForm(forms.ModelForm):
    category = forms.ModelChoiceField(ProductCategory.objects.all(),
                                      widget=forms.Select(
                                          attrs={'class': 'form-control col-sm-4',
                                                 'placeholder': ' Product Category',
                                                }))
    sub_category = forms.ModelChoiceField(ProductSubCategory.objects.all(),
                                      widget=forms.Select(
                                          attrs={'class': 'form-control col-sm-4', 'placeholder': ' Product Sub Category'}))
    brand = forms.ModelChoiceField(ProductBrandMaster.objects.all(),
                                          widget=forms.Select(
                                              attrs={'class': 'form-control col-sm-4',
                                                     'placeholder': ' Product Brand Master'}))

    class Meta:
        model = models.ProductMaster
        fields = [
            "hsn_code",
            "product_code",
            "product_image",
            "description",
            "product_name",
            "category",
            "sub_category",
            "brand",
        ]


class ProductCategoryForm(forms.ModelForm):
    class Meta:
        model = models.ProductCategory
        fields = [
            "category_code",
            "category_name",
            "description",
        ]
