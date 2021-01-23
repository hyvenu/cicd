from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from security.models import CustomerAddress
from security.serializer import UserSerializer, GroupSerializer, CustomTokenObtainPairSerializer, CustomerSerializer, \
    CustomerAddressSerializer

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


class CustomerViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]


class CustomerAddressViewSet(viewsets.ModelViewSet):

    queryset = CustomerAddress.objects.all()
    serializer_class = CustomerAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(customer_id=self.request.user.id)


@api_view(['POST'])
def change_password(request):
    data = request.data
    user = authenticate(username=data['username'], password=data['old_password'])
    user_obj = User.objects.get(id=user.id)
    if user is not None:
        user_obj.password = make_password(data['new_password'])
        user_obj.save()
        return JsonResponse(user, safe=False, status=status.HTTP_200_OK)
    else:
        return JsonResponse('Invalid credentials', safe=False, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def forget_password(request):
    data = request.data

    if 'email' in data:
        user = User.objects.get(email=data['email'])
        if user is not None:
            pass