import ast

from django.db import transaction

from store.models import StoreUser, Store, SiteSettings, AppointmentSchedule, AppointmentForMultipleService, Department, \
    Employee, StoreServices, Enquiry, Customer


class StoreService:

    def get_store_by_user(self, user_id):
        store_list = list(StoreUser.objects.filter(user_id=user_id).values('store__store_name', 'store_id'))
        return store_list

    def get_store_by_name(self, store_name):
        store = Store.objects.filter(store_name=store_name).values(
            'id',
            'store_name',
        )
        return store

    def get_store_list(self):
        store_list = Store.objects.all().values(
            'id',
            'store_name',
            'address',
            'city',
            'pin_code',
            'gst_no',

        )
        return list(store_list)

    def get_Site_Settings(self, setting_type):
        settings = SiteSettings.objects.filter(setting_Type=setting_type).values(
            'id',
            'setting_Type',
            'setting_Value'
        )
        return list(settings.values())

    def get_store_details(self, store_id):
        store = Store.objects.filter(id=store_id).all().values(
            'id',
            'store_name',
            'address',
            'city',
            'pin_code',
            'gst_no',
            'store_number',
            'email',
        )
        return list(store)

    @classmethod
    @transaction.atomic
    def update_bill(self, data):

        service_arr = data['service_id']
        for item in service_arr:
            app_id = AppointmentForMultipleService.objects.filter(id=item).values('appointment_id')[0]['appointment_id']
            AppointmentSchedule.objects.filter(id=app_id).update(is_paid=True)

            # if data['is_paid'] == "true":
            #     appointment_obj.is_paid = True
            # else:
            #     appointment_obj.is_paid = False
            # appointment_obj.save()

    @classmethod
    @transaction.atomic
    def update_advance_amount(self, data):

        if 'id' in data:
            Customer.objects.filter(id=data['id']).update(advance_amount=data['advance_amount'])

    @classmethod
    @transaction.atomic
    def save_Appointment(self, ap_data):
        if 'id' in ap_data:
            service_arr = ast.literal_eval(ap_data['service'])
            for item in service_arr:
                if 'id' in ap_data:
                    appointment_obj = AppointmentSchedule.objects.get(id=ap_data['id'])
                    if ap_data['assigned_staff'] == "null":
                        pass
                    else:
                        appointment_obj.assigned_staff_id = ap_data['assigned_staff']


                else:
                    appointment_obj = AppointmentSchedule()

                if ap_data['is_paid'] == "true":
                    appointment_obj.is_paid = True
                else:
                    appointment_obj.is_paid = False
                appointment_obj.store_id = ap_data['store']
                appointment_obj.booking_date = ap_data['booking_date']
                appointment_obj.end_time = ap_data['end_time']
                appointment_obj.customer_name = ap_data['customer_name']
                appointment_obj.start_time = ap_data['start_time']
                appointment_obj.phone_number = ap_data['phone_number']
                appointment_obj.customer_id = ap_data['customer']
                appointment_obj.save()
                # if 'id' in ap_data:
                #     service_arr = ap_data['service']
                # else:
                # service_arr = ap_data['service'].split(',')
                # service_list = ast.literal_eval(ap_data['service_arr'])
                # for item in service_arr:
                #     if 'id' in ap_data:
                #         service = AppointmentForMultipleService.objects.get(appointment_id=ap_data['id'])
                #     else:
                # for item in service_arr:
                #     if 'id' in item:
                #         service = AppointmentForMultipleService.objects.get(id=item['id'])
                #     else:
                if 'id' in item and len(item['id']) > 0:
                    service = AppointmentForMultipleService.objects.get(id=item['id'])
                else:
                    service = AppointmentForMultipleService()

                service.appointment = appointment_obj
                service.service_id = item['service_id']
                service.save()
        else:
            service_arr = ast.literal_eval(ap_data['service'])
            for item in service_arr:
                if 'id' in ap_data:
                    appointment_obj = AppointmentSchedule.objects.get(id=ap_data['id'])

                else:
                    appointment_obj = AppointmentSchedule()

                if ap_data['is_paid'] == "true":
                    appointment_obj.is_paid = True
                else:
                    appointment_obj.is_paid = False
                if ap_data['assigned_staff'] == "null":
                    pass
                else:
                    appointment_obj.assigned_staff_id = ap_data['assigned_staff']

                appointment_obj.store_id = ap_data['store']
                appointment_obj.booking_date = ap_data['booking_date']
                appointment_obj.end_time = ap_data['end_time']
                appointment_obj.customer_name = ap_data['customer_name']
                appointment_obj.start_time = ap_data['start_time']
                appointment_obj.phone_number = ap_data['phone_number']
                appointment_obj.customer_id = ap_data['customer']
                appointment_obj.save()
                # if 'id' in ap_data:
                #     service_arr = ap_data['service']
                # else:
                # service_arr = ap_data['service'].split(',')
                # service_list = ast.literal_eval(ap_data['service_arr'])
                # for item in service_arr:
                #     if 'id' in ap_data:
                #         service = AppointmentForMultipleService.objects.get(appointment_id=ap_data['id'])
                #     else:

                service = AppointmentForMultipleService()
                service.appointment = appointment_obj
                service.service_id = item['service_id']
                service.save()

        return appointment_obj.id

    def get_Appointment(self, customer_id):
        appointment = AppointmentSchedule.objects.filter(customer_id=customer_id, is_paid=False, ).exclude(
            assigned_staff_id__isnull=True).all().values(
            'id',
            'customer__id',
            'customer_name',
            'assigned_staff',
            'booking_date',
            'assigned_staff__employee_name',
            'phone_number',
            'customer',

        )

        for item in list(appointment):
            item['service_details'] = list(
                AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
                    "id",
                    "appointment__id",
                    "service__id",
                    "service__service_name",
                    "service__price",
                    "service__service_gst",

                ))
        return list(appointment)

    @classmethod
    def get_appointment_details(cls):
        final_list = []
        app_data_list = AppointmentSchedule.objects.all().values(
            'id',
            'assigned_staff__id',
            'assigned_staff__employee_name',
            'store_id',
            'booking_date',
            'end_time',
            'customer_name',
            'start_time',
            'phone_number',
            'appointment_status',
            'customer__id',
            'customer__customer_name',

        )

        for item in list(app_data_list):
            item['service_list'] = list(
                AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
                    "id",
                    "appointment__id",
                    "service__id",
                    "service__service_name",
                ))

        return list(app_data_list)

    @classmethod
    def get_appointment_details_byid(self, app_id):
        appointment_data_list = AppointmentSchedule.objects.filter(id=app_id).all().values(
            'id',
            'assigned_staff__id',
            'assigned_staff__employee_name',
            'store_id',
            'booking_date',
            'end_time',
            'customer_name',
            'start_time',
            'phone_number',
            'appointment_status',
            'customer__id',
            'customer__customer_name',

        )[0]

        appointment_data_list['service_list'] = list(
            AppointmentForMultipleService.objects.filter(appointment_id=app_id).all().values(
                "id",
                "appointment__id",
                "service__id",
                "service__service_name",
            ))
        return appointment_data_list

    @classmethod
    def get_viewbooking_details(cls):
        final_list = []
        app_data_list = AppointmentSchedule.objects.filter(is_paid=False).values(
            'id',
            'is_paid',
            'assigned_staff__id',
            'assigned_staff__employee_name',
            'store_id',
            'booking_date',
            'end_time',
            'customer_name',
            'start_time',
            'phone_number',
            'appointment_status',
            'customer__id',
            'customer__customer_name',

        )

        for item in list(app_data_list):
            item['service_list'] = list(
                AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
                    "id",
                    "appointment__id",
                    "service__id",
                    "service__service_name",
                ))

        return list(app_data_list)

    @classmethod
    def get_booking_details_dashboard(cls):
        final_list = []
        app_data_list = AppointmentSchedule.objects.all().values(
            'id',
            'assigned_staff__id',
            'assigned_staff__employee_name',
            'store_id',
            'booking_date',
            'end_time',
            'customer_name',
            'start_time',
            'phone_number',
            'appointment_status',
            'customer__id',
            'customer__customer_name',

        )

        for item in list(app_data_list):
            item['service_list'] = list(
                AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
                    "id",
                    "appointment__id",
                    "service__id",
                    "service__service_name",
                ))

        return list(app_data_list)

    def get_appointment_list(self):
        appointment_list = AppointmentSchedule.objects.all().values(
            'id',
            'assigned_staff__id',
            'customer__id',
            'service__id',
            'customer__customer_name',
            'service__service_name',
            'booking_date',
            'phone_number',
            'customer_name',
            'end_time',
            'start_time',
            'assigned_staff__employee_name',

        )
        return list(appointment_list)

    def get_store_service_list(self):
        store_list = StoreServices.objects.all().values(
            'id',
            'store',
            'service_name',
            'service_desc',
            'price',
            'service_gst',
            'service_hour',
        )
        return list(store_list)

    def get_employee_list(self):
        employee_list = Employee.objects.all().values(
            'id',
            'employee_code',
            'employee_name',
            'phone_number',
            'employee_address',
            'department__department_name',
            'dob',
            'doj',
            'salary',
            'admin_rights',
            'attendance_id',
            'pan_card',
            'account_number',
            'ifsc',
            'hrms_id',
            'gender',
            'employee_category',
            'pay_out',
            'grade',
            'login_access',

        )
        return list(employee_list)

    def get_enquiry_list(self):
        enquiry_list = Enquiry.objects.all().values(
            'id',
            'enquiry_code',
            'full_name',
            'phone_number',
            'service',
            'service__service_name',
            'staff_name__employee_name',
            'customer_email',
            'gender',
            'locality',
            'enquiry_date',
            'lead_source',
            'enquiry_type',
            'date',
            'time',
            'staff_name',
            'message',
            'call_log',

        )
        return list(enquiry_list)
