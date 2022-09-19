import ast
import datetime
import calendar

from django.db import transaction
from django.db.models import Sum, DateField
from django.db.models.functions import ExtractMonth, Cast

from store.models import StoreUser, Store, SiteSettings, AppointmentSchedule, AppointmentForMultipleService, Department, \
    Employee, StoreServices, Enquiry, Customer
from sales.models import SalesOrderRequest    
from purchase.models import GRNMaster  


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
        # print("ADVANCE AMOUNT %s"%data['advance_amount'])
        if 'id' in data:
            Customer.objects.filter(id=data['id']).update(advance_amount=data['advance_amount'])

    """
    Booking: New and Update (customer details and services)
    """
    @classmethod
    @transaction.atomic
    def save_Appointment(self, ap_data):
        if 'id' in ap_data:
            appointment_obj = AppointmentSchedule.objects.get(id=ap_data['id'])
            if ap_data['is_paid'] == "true":
                appointment_obj.is_paid = True
            else:
                appointment_obj.is_paid = False

            #appointment_obj.store_id = ap_data['store']
            appointment_obj.booking_date = ap_data['booking_date']
            appointment_obj.customer_id = ap_data['customer']
            appointment_obj.save()

            try:        
                #delete all services first        
                service_obj = AppointmentForMultipleService.objects.filter(appointment_id=ap_data['id']).all()
                service_obj.delete()
            except AppointmentForMultipleService.DoesNotExist:
                raise Exception("Not Exist")

            #then populate services currently added/retained            
            service_arr = ast.literal_eval(ap_data['services']) #services array
            # print("service list %s", service_arr)
            for item in service_arr:
                # print("end time %s",item['end_time'])

                service_obj = AppointmentForMultipleService()
                service_obj.appointment_id = ap_data['id']
                service_obj.assigned_staff_id = item['stylist_id']
                service_obj.service_id = item['service_id']
                service_obj.start_time = item['start_time']
                service_obj.end_time= item['end_time']
                service_obj.save()
                    
        else:
            # print("new booking %s"%ap_data)
           
            #check if same date already booked for this customer AND not billed AKA is_paid = Flase
            try:
                appointment_obj = AppointmentSchedule.objects.get(booking_date=ap_data['booking_date'], customer_id=ap_data['customer'], is_paid=False)
                #count = appointment_obj.count()
                #print("found appointment for the given date, count is %s"%count)
                # print("Found appointment for given date")
                service_arr = ast.literal_eval(ap_data['services'])
                #insert services for the same appointment id
                for item in service_arr:                    
                    #service_count = service_obj.count()

                    #service already found for the same appointment: update service
                    try:
                        service_obj = AppointmentForMultipleService.objects.get(appointment_id=appointment_obj.id, service_id=item['service_id'])
                        service_obj.assigned_staff_id = item['stylist_id']
                        service_obj.start_time = item['start_time']
                        service_obj.end_time= item['end_time']
                        service_obj.save()
                    except AppointmentForMultipleService.DoesNotExist:
                        #service not found for the same appointment: insert new service
                        service_obj = AppointmentForMultipleService()
                        service_obj.appointment_id = appointment_obj.id
                        service_obj.assigned_staff_id = item['stylist_id']
                        service_obj.service_id = item['service_id']
                        service_obj.start_time = item['start_time']
                        service_obj.end_time= item['end_time']
                        service_obj.save()    
            except AppointmentSchedule.DoesNotExist:
                #no appointments found for the given date: insert new appointment
                appointment_obj = AppointmentSchedule()

                appointment_obj.is_paid = False
                appointment_obj.store_id = ap_data['store']
                appointment_obj.booking_date = ap_data['booking_date']
                appointment_obj.customer_id = ap_data['customer']
                appointment_obj.save()

                service_arr = ast.literal_eval(ap_data['services'])
                #insert services for this new appointment
                for item in service_arr:
                    service_obj = AppointmentForMultipleService()
                    service_obj.appointment_id = appointment_obj.id
                    service_obj.assigned_staff_id = item['stylist_id']
                    service_obj.service_id = item['service_id']
                    service_obj.start_time = item['start_time']
                    service_obj.end_time= item['end_time']
                    service_obj.save()
            

        return appointment_obj.id

    def delete_appointment(self, app_id):
        # print("Called booking delete %s"%app_id)
        entry = AppointmentSchedule.objects.filter(id=app_id)
        count = entry.delete()
        # print("COUNTe %s"%count[0])
        return count

    """
    Booking History: Get particular customer booking history
    """
    def get_Appointment(self, customer_id):
        app_data_list = AppointmentSchedule.objects.filter(customer_id=customer_id).all().values(
            'id',
            'is_paid',            
            'booking_date'
        )
        
        for item in list(app_data_list):
            item['service_list'] = list(
                AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
                    "id",
                    "service__service_name",
                    "assigned_staff__employee_name",
                    "start_time",
                    "end_time"
                ))

        return list(app_data_list)

    """
    Booking History: Get particular customer booking history by appointment id
    """
    def get_app_forbill(self, app_id):
        app_data_list = AppointmentSchedule.objects.filter(id=app_id, is_paid=False).all().values(
            'id',
            'is_paid',            
            'booking_date',
            'customer__id',
            'customer__customer_name',
            'customer__phone_number', 
            'customer__customer_email',
            'customer__advance_amount'
        )
        
        for item in list(app_data_list):
            # item['service_list'] \
            service_list = list(
                AppointmentForMultipleService.objects.filter(appointment_id=app_id).all().values(
                    # "id",
                    "service__id",
                    "service__service_name",
                    "service__price",
                    "service__service_gst",
                    "service__unit",
                    "service__unit__PrimaryUnit"
                ).distinct())
            serv_list = []
            for serv in service_list:
                employee_list = AppointmentForMultipleService.objects.filter(appointment_id=app_id,service_id=serv['service__id'])\
                    .all().values(
                    "assigned_staff__employee_name",
                    "assigned_staff__id"
                )
                emp_list = [dict(emp_id=emp['assigned_staff__id'],employee_name=emp['assigned_staff__employee_name']) for emp in employee_list]
                serv['employee_list'] = emp_list
                serv_list.append(serv)

            item['service_list'] = serv_list





        return list(app_data_list)    

    
        
    @classmethod
    def get_appointment_details(cls):
        final_list = []
        app_data_list = AppointmentSchedule.objects.all().values(
            'id',            
            'store_id',
            'booking_date',   
            'appointment_status',  
            'customer__id',
            'customer__customer_name',
            'customer__phone_number', 

        )

        for item in list(app_data_list):
            item['service_list'] = list(
                AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
                    "id",
                    "appointment__id",
                    "service__id",
                    "service__service_name",
                    "assigned_staff__id",
                    "assigned_staff__employee_name",
                    "start_time",
                    "end_time",
                ))

        return list(app_data_list)

    @classmethod
    def get_appointment_details_calendar(self, store_id, date):
        # print("CALENDAR PARAM %s"%date)
        app_data_list = AppointmentSchedule.objects.filter(store_id=store_id, booking_date=date).all().values(
            'id',            
            'store_id',
            'booking_date',   
            'appointment_status',  
            'customer__id',
            'customer__customer_name',
            'customer__phone_number', 

        )

        for item in list(app_data_list):
            item['service_list'] = list(
                AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
                    "id",
                    "service__id",
                    "service__service_name",
                    "assigned_staff__id",
                    "assigned_staff__employee_name",
                    "start_time",
                    "end_time",
                ))

        return list(app_data_list)    

    @classmethod
    def get_appointment_details_byid(self, app_id):
        # print("IDDDD %s"%app_id)
        appointment_data_list = AppointmentSchedule.objects.filter(id=app_id).all().values(
            'id',            
            'store_id',
            'booking_date',   
            'appointment_status',         
            'customer__id',
            'customer__customer_name',
            'customer__phone_number', 
            'customer__customer_email',
            'customer__advance_amount'

        )[0]

        appointment_data_list['service_list'] = list(
            AppointmentForMultipleService.objects.filter(appointment_id=app_id).all().values(
                "id",
                "appointment__id",
                "service__id",
                "service__service_name",
                "assigned_staff__id",
                "assigned_staff__employee_name",
                "start_time",
                "end_time",
            ))
        return appointment_data_list

    @classmethod
    def get_appointment_details_by_customer(self, cust_id):
        
        app_data_list = AppointmentSchedule.objects.filter(customer_id=cust_id, is_paid=False).all().values(
            'id',
            'is_paid',            
            'booking_date',
            'appointment_status',         
            'customer__id',
            'customer__customer_name',
            'customer__phone_number', 
            'customer__customer_email',
            'customer__advance_amount'


        )

        for item in app_data_list:
            item['service_list'] = list(AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
                    "id",
                    "appointment__booking_date",
                    "service__id",
                    "service__service_name",
                    "service__price",
                    "service__service_gst",
                    "assigned_staff__employee_name",
                    "start_time",
                    "end_time",
                    "service__unit",
                    "service__unit__PrimaryUnit"
                ))

        return list(app_data_list)
        
        # count = app_data_list.count()  

        # if count > 0: 

        #     for item in list(app_data_list):
        #         itemList = list(AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
        #                 "id",
        #                 "service__id",
        #                 "service__service_name",
        #                 "service__price",
        #                 "service__service_gst",
        #                 "assigned_staff__employee_name",
        #                 "start_time",
        #                 "end_time",
        #                 "service__unit",
        #                 "service__unit__PrimaryUnit"
        #         ))

        #         for obj in itemList:
        #             service_list.append(obj)

        #     app_data_list[0]['service_list'] = service_list   
                
        #     final_list.append(app_data_list[0])

        
        # return list(final_list)        


    @classmethod
    def get_viewbooking_details(cls,branch_id):
        # print("GET BOOKINGS")
        final_list = []
        if branch_id:
            app_list_object = AppointmentSchedule.objects.filter(is_paid=False,store_id=branch_id)
        else:
            app_list_object = AppointmentSchedule.objects.filter(is_paid=False)

        app_data_list = app_list_object.values(
            'id',
            'is_paid',  
            'booking_date',          
            'store_id',  
            'appointment_status',
            'customer__id',
            'customer__customer_name',
            'customer__phone_number'
        )

        for item in app_data_list:
            item['service_list'] = list(
                AppointmentForMultipleService.objects.filter(appointment_id=item['id']).all().values(
                    "id",                    
                    "appointment__id",                   
                    "assigned_staff__id",
                    "assigned_staff__employee_name",
                    "service__id",
                    "service__service_name",
                    "start_time",
                    "end_time"
                ))

        return list(app_data_list)        

    @classmethod
    def get_all_viewbooking_details(cls):
        final_list = []
        app_data_list = AppointmentSchedule.objects.all().values(
            'id',
            'is_paid',            
            'booking_date',
            'store_id',
            'appointment_status',
            'customer__id',
            'customer__customer_name',
            'customer__phone_number'
        )

        
        for item in list(app_data_list):
            count = AppointmentForMultipleService.objects.filter(appointment_id=item['id']).count()
            item['service_count'] = count

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

    def get_employee_list(self, bid):
        employee_list = Employee.objects.filter(store_id=bid).all().values(
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

    def get_service_list(self):
        service_list = StoreServices.objects.all().values(
            'id',
            'service_name', 
            'service_desc', 
            'price', 
            'service_gst', 
            'service_hour', 
            'unit__id',
            'unit__PrimaryUnit',
            'unit__SecondaryUnit'
        )
        return list(service_list)

    # def get_all_service_list(self):
    #     service_dict = StoreServices.objects.all().values(
    #             "id",
    #             "service_name",
    #             "service_desc",
    #             "price",
    #             "service_gst",
    #             "unit",
    #             "unit__PrimaryUnit",
    #         )

    #     return list(service_dict)                

    def save_service(self, data):
        # print("Post Data %s"%data['store'])
        service_obj = StoreServices()

        service_obj.store_id = data['store']
        service_obj.service_name = data['service_name']
        service_obj.service_desc = data['service_desc']
        service_obj.price = data['price']
        service_obj.service_gst = data['service_gst']
        service_obj.service_hour = data['service_hour']        
        service_obj.unit_id = data['unit']
        service_obj.save()

        return service_obj.id 

    def update_service(self, data):
        service = StoreServices.objects.get(id=data['service_id'])

        service.service_name = data['service_name']
        service.service_desc = data['service_desc']
        service.price = data['price']
        service.service_gst = data['service_gst']
        service.service_hour = data['service_hour']
        service.unit_id = data['unit']
        service.save()

        return service.id

    def delete_service(self, id):
        # print("Called service delete %s"%id)
        entry = StoreServices.objects.filter(id=id)
        count = entry.delete()
        # print("COUNTe %s"%count[0])
        return count        


