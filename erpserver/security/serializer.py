from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from security.models import CustomerAddress

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','email','password', 'is_staff']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        return user


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user_id'] = self.user.id
        data['first_name'] = self.user.first_name
        data['phone_number'] = self.user.phone_number
        data['permission'] = self.user.get_all_permissions()

        return data


class CustomerAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomerAddress
        fields = [
            'id',
            "customer",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "pin_code",
            "phone_number",
        ]


class CustomerSerializer(serializers.ModelSerializer):
    customer_address = CustomerAddressSerializer()

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'email',
            'customer_address',

        ]