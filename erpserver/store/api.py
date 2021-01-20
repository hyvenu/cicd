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
