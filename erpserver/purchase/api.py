from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from purchase import models, serializers
from purchase.service import PurchaseService


class PurchaseRequisitionViewSet(viewsets.ModelViewSet):
    queryset = models.PurchaseRequisition.objects.all()
    serializer_class = serializers.PurchaseRequisitionSerializer
    permission_classes = [permissions.IsAuthenticated]
