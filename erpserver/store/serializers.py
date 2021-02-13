from rest_framework import serializers

from . import models
from .models import Store


class StoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Store
        fields = [
            "id",
            "store_name",
            "address",
            "city",
            "pin_code",
            "gst_no",
            "is_head_office"
        ]

class StoreUserSerializer(serializers.ModelSerializer):
    store = StoreSerializer(many=False, read_only=True)
    class Meta:
        model = models.StoreUser
        fields = [
            "id",
            "user",
            "store",
        ]

class AppSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AppSettings
        fields = [
            'app_key',
            'app_value',
        ]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Department
        fields = [
            'id',
            'department_id',
            'department_name',
        ]

class StoreShipLocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StoreShipLocations
        fields = [
            'id',
            'store',
            'pin_code',
            'location_name',
            'is_active'
        ]

class ProductCampaignsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductCampaigns
        fields = [
            'id',
            'code',
            'type',
            'start_time',
            'end_time',
            'max_use',
            'use_count',
            'value',
            'min_order_amount',
        ]