from rest_framework import serializers
from sequences import get_next_value

from . import models
from .models import Store


def generate_department_code():
    prefix_code = 'D5N-DPT'
    code = get_next_value(prefix_code)
    code = prefix_code + '-' + str(code)
    return code


def generate_designation_code():
    prefix_code = 'D5N-DSG'
    code = get_next_value(prefix_code)
    code = prefix_code + '-' + str(code)
    return code


def generate_employee_code():
    prefix_code = 'D5N-EMP'
    code = get_next_value(prefix_code)
    code = prefix_code + '-' + str(code)
    return code


def generate_enquiry_code():
    prefix_code = 'D5N-ENQ'
    code = get_next_value(prefix_code)
    code = prefix_code + '-' + str(code)
    return code


def generate_members_code():
    prefix_code = 'D5N-MEM'
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
            "is_head_office",
            "email",
            "store_number",
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
            'active'
        ]

    def create(self, validated_data):
        validated_data['department_id'] = generate_department_code()
        desig = super().create(validated_data)
        return desig


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Designation
        fields = [
            'id',
            'designation_id',
            'designation_name',
            'active',
        ]

    def create(self, validated_data):
        validated_data['designation_id'] = generate_designation_code()
        desig = super().create(validated_data)
        return desig


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
        fields = ['id', 'store', 'service_name', 'service_desc', 'price', 'service_gst', 'service_hour', 'unit']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Customer
        fields = ['id',
                  'customer_code',
                  'customer_name',
                  'phone_number',
                  'customer_email',
                  'customer_service_bill',
                  'customer_address',
                  'gst',
                  'active',
                  'advance_amount']

    def create(self, validated_data):
        validated_data['customer_code'] = generate_customer_code()
        cus = super().create(validated_data)
        return cus


class EmployeeSerializer(serializers.ModelSerializer):


    # def validate_account_number(self, value):
    #     if not value:
    #         return 0
    #     try:
    #         return int(value)
    #     except ValueError:
    #         raise serializers.ValidationError('You must supply an integer')
    #
    # def validate_salary(self, value):
    #     if not value:
    #         return 0
    #     try:
    #         return int(value)
    #     except ValueError:
    #         raise serializers.ValidationError('You must supply an integer')

    class Meta:
        model = models.Employee
        fields = ['id', 'employee_code', 'employee_name', 'phone_number', 'department', 'employee_address',
                  'dob', 'doj', 'salary', 'job_designation', 'admin_rights', 'attendance_id', 'pan_card',
                  'account_number',
                  'ifsc', 'hrms_id', 'gender', 'employee_category', 'pay_out', 'job_designation', 'grade',
                  'login_access']

    def create(self, validated_data):
        validated_data['employee_code'] = generate_employee_code()
        emp = super().create(validated_data)
        return emp

    def to_representation(self, instance):
        data = super(EmployeeSerializer, self).to_representation(instance)
        data['department_name'] = models.Employee.objects.filter(department_id=data['department']).all().values(
            'department__department_name')[0]['department__department_name']

        data['designation_name'] = \
        models.Employee.objects.filter(job_designation_id=data['job_designation']).all().values(
            'job_designation__designation_name')[0]['job_designation__designation_name']
        return data


class AppointmentForMultipleService(serializers.ModelSerializer):
    class Meta:
        model = models.AppointmentSchedule
        fields = ['id', 'appointment_id', ' service']


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Enquiry
        fields = ['id', 'enquiry_code', 'full_name', 'phone_number', 'service', 'customer_email',
                  'gender', 'locality', 'enquiry_date', 'lead_source', 'enquiry_type', 'date', 'time',
                  'staff_name',
                  'message', 'call_log', ]

    def create(self, validated_data):
        validated_data['enquiry_code'] = generate_enquiry_code()
        enq = super().create(validated_data)
        return enq

    def to_representation(self, instance):
        data = super(EnquirySerializer, self).to_representation(instance)
        data['service_name'] = models.Enquiry.objects.filter(service_id=data['service']).all().values(
            'service__service_name')[0]['service__service_name']

        data['employee_name'] = \
            models.Enquiry.objects.filter(staff_name_id=data['staff_name']).all().values(
                'staff_name__employee_name')[0]['staff_name__employee_name']
        return data


class MembersDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MembersDetails
        fields = ['id', 'members_code', 'full_name', 'phone_number', 'customer_email', 'gender',
                  'dob', 'locality', 'vacinated', 'lead_source', 'sales_rep', 'members_maneger', 'batch',
                  'attendance_id',
                  'club_id', 'gst_no', 'emergency_ccontact', 'emergency_number', 'relationship', 'notification', 'sms',
                  'email',
                  'occupation', 'offical_mail', 'company_name']

    def create(self, validated_data):
        validated_data['members_code'] = generate_members_code()
        mem = super().create(validated_data)
        return mem


class AppointmentScheduleSerializer(serializers.ModelSerializer):
    assigned_staff = serializers.CharField(max_length=230, allow_blank=True, default="")

    class Meta:
        model = models.AppointmentSchedule
        fields = ['id', 'assigned_staff', 'service', 'booking_date', 'customer_name',
                  'phone_number', 'appointment_status', 'store', 'customer', 'is_paid']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['assigned_staff_det'] = EmployeeSerializer(instance.assigned_staff).data
        return response


