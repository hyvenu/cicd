from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from . import serializers
from . import models
from .service import InventoryService


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # self.perform_create(serializer)
        inventoryService = InventoryService()
        inventoryService.save_sub_category(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)



class ProductMasterViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductMaster class"""

    queryset = models.ProductMaster.objects.all()
    serializer_class = serializers.ProductMasterSerializer
    permission_classes = [permissions.IsAuthenticated]


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inventoryService = InventoryService()
        serializer_data = inventoryService.save_product(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        inventoryService = InventoryService()
        serializer_data = inventoryService.save_product(serializer)
        headers = self.get_success_headers(serializer_data)
        return Response(serializer_data, status=status.HTTP_202_ACCEPTED, headers=headers)



class ProductCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductCategory class"""

    queryset = models.ProductCategory.objects.all()
    serializer_class = serializers.ProductCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductImagesViewSet(viewsets.ModelViewSet):

    queryset = models.ProductImages.objects.all()
    serializer_class = serializers.ProductImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if 'product_id' in self.request.query_params:
            product_id = self.request.query_params['product_id']
            return self.queryset.filter(product_id=product_id)
        else:
            return self.queryset


class ProductStockViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductMaster class"""

    queryset = models.ProductStock.objects.all()
    serializer_class = serializers.ProductStockSerializer
    permission_classes = [permissions.IsAuthenticated]