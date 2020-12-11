from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from security.serializer import UserSerializer, GroupSerializer, CustomTokenObtainPairSerializer

User = get_user_model()


class CreateUserAPIView(ListCreateAPIView):
    # Allow any user (authenticated or not) to access this url
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    # security = SecurityService()

    def perform_create(self, serializer):
        serializer.save()

    def list(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    token_obtain_pair = TokenObtainPairView