from rest_framework import serializers
from sequences import get_next_value

from . import models
from .models import Store


def generate_employee_code():
    prefix_code = 'D5N-EMP'
    code = get_next_value(prefix_code)
    code = prefix_code + '-' + str(code)
    return code


def generate_customer_code():
    prefix_code = 'D5N-CUS'
    code = get_next_value(prefix_code)
    code = prefix_code + '-' + str(code)
    return code


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
        fields = ['id', 'setting_Type', 'setting_Value']


class StoreServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StoreServices
        fields = ['id', 'store', 'service_name', 'service_desc', 'price', 'service_gst']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Customer
        fields = ['id',
                  'customer_code',
                  'customer_name',
                  'phone_number',
                  'customer_email',
                  'customer_service_bill',
                  'customer_address']

    def create(self, validated_data):
        validated_data['customer_code'] = generate_customer_code()
        cus = super().create(validated_data)
        return cus


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Employee
        fields = ['id', 'employee_code', 'employee_name', 'phone_number', 'department', 'employee_address']

    def create(self, validated_data):
        validated_data['employee_code'] = generate_employee_code()
        emp = super().create(validated_data)
        return emp


class AppointmentScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AppointmentSchedule
        fields = ['id', 'assigned_staff', 'service', 'booking_date', 'end_time', 'customer_name', 'start_time',
                  'phone_number', 'appointment_status', 'store', 'customer', 'is_paid']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['assigned_staff_det'] = EmployeeSerializer(instance.assigned_staff).data
        return response
