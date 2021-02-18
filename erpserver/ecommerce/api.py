from rest_framework import permissions, viewsets

from ecommerce import models, serializer


class RatingViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductPriceMaster class"""

    queryset = models.Rating.objects.all()
    serializer_class = serializer.RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if 'product_id' in self.request.query_params:
            product_id = self.request.query_params['product_id']
            return self.queryset.filter(product_id=product_id)
        else:
            return self.queryset

