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


class SiteSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.SiteSettings
        fields = ['id','setting_Type', 'setting_Value']


class StoreServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.StoreServices
        fields = ['id','store','service_name','service_desc','price']


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Customer
        fields = ['id', 'customer_name', 'phone_number']

class AppointmentScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.AppointmentSchedule
        fields = ['id','assigned_staff','service','booking_date','end_time','customer_name','start_time','phone_number','appointment_status','store']


class EmployeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Employee
        fields = ['id', 'employee_name', 'phone_number']