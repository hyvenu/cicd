from store.models import StoreUser, Store, SiteSettings, AppointmentSchedule


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

    def get_Site_Settings(self, setting_type):
        settings = SiteSettings.objects.filter(setting_Type=setting_type).values(
            'id',
            'setting_Type',
            'setting_Value'
        )
        return list(settings.values())

    def get_Appointment(self, customer_id):
        appointment = AppointmentSchedule.objects.filter(customer_id=customer_id, is_paid=False).all().values(
            'id',
            'customer__id',
            'customer_name',
            'service__service_name',
            'booking_date',
            'assigned_staff__employee_name',
            'phone_number',
            'customer',
            'service__price',
            'service__id',
            'service__service_gst',

        )
        return list(appointment)

    def get_appointment_list(self, service_id):
        appointment_list = AppointmentSchedule.objects.all(service__Id=service_id).values(
            'id',
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
