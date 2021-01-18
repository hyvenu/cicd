from rest_framework import viewsets,permissions
from . import models, serializers


class POOrderRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductBrandMaster class"""

    queryset = models.POOrderRequest.objects.all()
    serializer_class = serializers.POOrderRequestSerializer
    permission_classes = [permissions.IsAuthenticated]