from rest_framework import viewsets, permissions

from . import serializers
from . import models


class StoreViewSet(viewsets.ModelViewSet):
    """ViewSet for the Store class"""

    queryset = models.Store.objects.all()
    serializer_class = serializers.StoreSerializer


class StoreUserViewSet(viewsets.ModelViewSet):
    """ViewSet for the Store class"""

    queryset = models.StoreUser.objects.all()
    serializer_class = serializers.StoreUserSerializer

    def get_queryset(self):
        if 'query' in self.request.query_params['query'] and self.request.query_params['query'] == 'all':
            return models.StoreUser.objects.all()
        else:
            return models.StoreUser.objects.filter(user_id=self.request.user.id).all()


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = models.Department.objects.all()
    serializer_class = serializers.DepartmentSerializer


class StoreShipLocationsViewSet(viewsets.ModelViewSet):
    queryset = models.StoreShipLocations.objects.all()
    serializer_class = serializers.StoreShipLocationsSerializer

    def get_queryset(self):
        if 'store_id' in self.request.query_params:
            return models.StoreShipLocations.objects.filter(store_id=self.request.query_params['store_id']).all()
        else:
            return models.StoreShipLocations.objects.all()


class ProductCampaignsViewSet(viewsets.ModelViewSet):
    queryset = models.ProductCampaigns.objects.all()
    serializer_class = serializers.ProductCampaignsSerializer

class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = models.SiteSettings.objects.all()
    serializer_class = serializers.SiteSettingsSerializer
