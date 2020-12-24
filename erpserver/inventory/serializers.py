from rest_framework import serializers

from . import models
from .models import ProductPriceMaster

class ProductCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ProductCategory
        fields = [
            "category_code",
            "category_name",
            "description",
            "id",
        ]


class ProductPriceMasterSerializer(serializers.ModelSerializer):
    # product_name = serializers.RelatedField(source='product', read_only=True)

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
            "ob_qty",
        ]

class ProductBrandMasterSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ProductBrandMaster
        fields = [
            "brand_image",
            "brand_name",
            "id",
        ]

class UnitMasterSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UnitMaster
        fields = [
            "PrimaryUnit",
            "SecondaryUnit",
            "id",
        ]

class ProductSubCategorySerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    class Meta:
        model = models.ProductSubCategory
        fields = [
            "sub_category_name",
            "sub_category_code",
            "category",
            "id",
        ]

class ProductMasterSerializer(serializers.ModelSerializer):
    product_product_master = serializers.PrimaryKeyRelatedField(many=True,read_only=True)
    class Meta:
        model = models.ProductMaster
        fields = [
            "product_product_master",
            "hsn_code",
            "product_code",
            "product_image",
            "description",
            "product_name",
            "category",
            "sub_category",
            "brand",
            "id",
        ]

