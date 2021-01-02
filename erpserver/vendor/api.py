from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from vendor import models, serializers
from vendor.service import VendorService


class VendorMasterViewSet(viewsets.ModelViewSet):
    queryset = models.VendorMaster.objects.all()
    serializer_class = serializers.VendorMasterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vendorService = VendorService()
        serializer_data = vendorService.save_vendor(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        vendorService = VendorService()
        serializer_data = vendorService.save_vendor(serializer)
        headers = self.get_success_headers(serializer_data)
        return Response(serializer_data, status=status.HTTP_202_ACCEPTED, headers=headers)
