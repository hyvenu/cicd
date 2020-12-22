from rest_framework import viewsets, permissions

from . import serializers
from . import models


class ProductPriceMasterViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductPriceMaster class"""

    queryset = models.ProductPriceMaster.objects.all()
    serializer_class = serializers.ProductPriceMasterSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductBrandMasterViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductBrandMaster class"""

    queryset = models.ProductBrandMaster.objects.all()
    serializer_class = serializers.ProductBrandMasterSerializer
    permission_classes = [permissions.IsAuthenticated]


class UnitMasterViewSet(viewsets.ModelViewSet):
    """ViewSet for the UnitMaster class"""

    queryset = models.UnitMaster.objects.all()
    serializer_class = serializers.UnitMasterSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductSubCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductSubCategory class"""

    queryset = models.ProductSubCategory.objects.all()
    serializer_class = serializers.ProductSubCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductMasterViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductMaster class"""

    queryset = models.ProductMaster.objects.all()
    serializer_class = serializers.ProductMasterSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductCategory class"""

    queryset = models.ProductCategory.objects.all()
    serializer_class = serializers.ProductCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
