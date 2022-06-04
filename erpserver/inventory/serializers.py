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
class UnitMasterSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UnitMaster
        fields = [
            "PrimaryUnit",
            "SecondaryUnit",
            "PrimaryUnitMeasurement",
            "SecondaryUnitMeasurement",
            "id",
        ]

class ProductPriceMasterSerializer(serializers.ModelSerializer):
    # product_name = serializers.RelatedField(source='product', read_only=True)
    unit = UnitMasterSerializer(read_only=True)

    class Meta:
        model = models.ProductPriceMaster
        fields = [
            "buy_price",
            "sell_price",
            "mrp",
            "product",
            "unit",
            "tax",
            "unit_price",
            "qty",
            "id",
            "bar_code",
            "safety_stock_level",
            "serial_number",
            'purchase_price',
            'cess_percent',
            'cess_amount',
            'box_qty',
            'ob_qty',
            'ob_value',
        ]

class ProductBrandMasterSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ProductBrandMaster
        fields = [
            "brand_image",
            "brand_name",
            "id",
        ]



class ProductSubCategorySerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    class Meta:
        model = models.ProductSubCategory
        fields = [
            "sub_category_name",
            "sub_category_code",
            "sub_category_image",
            "description",
            "category",
            "id",
        ]

class ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ProductImages
        fields = ['id','product_id','image']

class ProductMasterSerializer(serializers.ModelSerializer):
    # product_product_master = serializers.PrimaryKeyRelatedField(many=True,read_only=True)
    product_price = ProductPriceMasterSerializer(many=True,read_only=True)
    category = ProductCategorySerializer(read_only=True)
    sub_category = ProductSubCategorySerializer(read_only=True)
    brand = ProductBrandMasterSerializer(read_only=True)
    product_images = ProductImageSerializer(read_only=True, many=True)

    class Meta:
        model = models.ProductMaster
        fields = [
            "hsn_code",
            "product_code",
            "description",
            "product_name",
            "category",

            "sub_category",
            "active",
            "brand",
            "id",
            'product_attributes',
            "product_price",
            "product_images",

        ]

class StockAdjustmentSerializer(serializers.ModelSerializer):
    # product_name = StockAdjustmentSerializer(many=False,read_only=True)
    class Meta:

        model = models.StockAdjustment
        fields = [
                    "id",
                    "product_name",
                    "product",
                    "date",
                    "ob_qty",
                 ]

class ProductStockSerializer(serializers.ModelSerializer):
    unit = UnitMasterSerializer(many=False,read_only=True)
    # store = StoreSerializer(many=False,read_only=True)
    product = ProductMasterSerializer(many=False,read_only=True)
    pack = ProductPriceMasterSerializer(many=False,read_only=True)
    class Meta:
        model = models.ProductStock
        fields = [
            "id",
            "product",
            "grn_number",
            "store",
            "pack",
            "unit",
            "batch_number",
            "batch_expiry",
            "quantity",
        ]

