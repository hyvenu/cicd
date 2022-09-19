from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
from django.urls import reverse

from audit_fields.models import AuditUuidModelMixin
#from inventory import models as imd
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

User = get_user_model()


class Store(AuditUuidModelMixin):
    store_name = models.CharField(max_length=255, null=False)
    store_number = models.CharField(max_length=255, null=False)
    address = models.TextField(max_length=500, null=False)
    email = models.CharField(max_length=255, null=False)
    city = models.CharField(max_length=100, null=True, blank=False)
    pin_code = models.CharField(max_length=10, null=True, blank=False)
    gst_no = models.CharField(max_length=50, null=True, blank=False)
    is_head_office = models.BooleanField(default=False)
    state_code = models.IntegerField(null=True, default=0)
    state_name = models.CharField(max_length=50, default="")

    class Meta:
        pass

    def __str__(self):
        return str(self.store_name)

    def get_absolute_url(self):
        return reverse("store_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("store_update", args=(self.pk,))


class StoreUser(AuditUuidModelMixin):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="store_user")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_store")

    class Meta:
        pass

    def __str__(self):
        return str(self.user)


class AppSettings(AuditUuidModelMixin):
    app_key = models.CharField(max_length=50)
    app_value = models.CharField(max_length=1000)

    class Meta:
        pass


class Department(AuditUuidModelMixin):
    department_id = models.CharField(max_length=30,null=True,blank=True)
    department_name = models.CharField(max_length=100, unique=True)
    active = models.BooleanField(default=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.department_name)


class Designation(AuditUuidModelMixin):
    designation_id = models.CharField(max_length=230, default="")
    designation_name = models.CharField(max_length=100, default="", unique=True)
    active = models.BooleanField(default=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.designation_name)


class StoreShipLocations(AuditUuidModelMixin):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="store_locations")
    pin_code = models.CharField(max_length=50, null=True)
    location_name = models.CharField(max_length=255, null=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        pass


class ProductCampaigns(AuditUuidModelMixin):
    code = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=100, null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    value = models.FloatField(null=True, blank=True, default=0)
    max_use = models.IntegerField(null=True, blank=True, default=0)
    use_count = models.IntegerField(null=True, blank=True, default=0)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        pass


class SiteSettings(AuditUuidModelMixin):
    setting_Type = models.CharField(null=False, max_length=1000)
    setting_Value = models.TextField(null=False)

    class Meta:
        pass


class StoreServices(AuditUuidModelMixin):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    service_name = models.CharField(max_length=100,unique=True)
    service_desc = models.CharField(max_length=4000)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    service_gst = models.CharField(max_length=100, default="0", blank=True)
    service_hour = models.CharField(max_length=100, default="") 
    unit = models.ForeignKey("inventory.UnitMaster", on_delete=models.CASCADE,default=None,null=True)

    class Meta:
        verbose_name_plural = "Services"

    def __str__(self):
        return str(self.service_name)


class Customer(AuditUuidModelMixin):
    # Fields
    customer_code = models.CharField(max_length=255, default=None)
    customer_name = models.CharField(max_length=255, default=None)
    phone_number = models.CharField(max_length=30, null=True, default=None, unique=True)
    customer_email = models.CharField(max_length=255, default=None,null=True,blank=True)
    customer_service_bill = models.CharField(max_length=255, default="")
    customer_address = models.CharField(max_length=255, default="",blank=True, null=True)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    gst = models.CharField(max_length=255, default="", null=True,blank=True)
    active = models.BooleanField(null=True,default=True)
    customer_source = models.CharField(max_length=255, default=None,null=True,blank=True)
    branch = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="customer_branch",null=True,blank=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.customer_name)


class Employee(AuditUuidModelMixin):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, default=None, null=True, related_name="employee_store")
    employee_code = models.CharField(max_length=255, default=None)
    employee_name = models.CharField(max_length=255, default=None)
    phone_number = models.CharField(max_length=10, default=None, null=True, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True)
    employee_address = models.CharField(max_length=255, default="")
    dob = models.DateField(null=True,)
    doj = models.DateField(null=True,)
    salary = models.BigIntegerField(null=True, blank=True, default=0,)
    job_designation = models.ForeignKey(Designation, on_delete=models.CASCADE, null=True, blank=True)
    admin_rights = models.CharField(max_length=255, default="",null=True,blank=True)
    attendance_id = models.CharField(max_length=255, default="",null=True,blank=True)
    pan_card = models.CharField(max_length=255, default="",blank=True)
    account_number = models.BigIntegerField(null=True, blank=True, default=0,)
    ifsc = models.CharField(max_length=255, default="",null=True,blank=True)
    hrms_id = models.CharField(max_length=255, default="",null=True,blank=True)
    gender = models.CharField(max_length=255, default="",null=True,blank=True)
    employee_category = models.CharField(max_length=255, default=None,null=True,blank=True)
    pay_out = models.CharField(max_length=255, default="",null=True,blank=True)
    grade = models.CharField(max_length=255, default="",null=True,blank=True)
    login_access = models.CharField(max_length=255, default="",null=True,blank=True)
    active = models.BooleanField(default=False)

    class Meta:
        pass

    def __str__(self):
        return str(self.employee_name)


class AppointmentSchedule(AuditUuidModelMixin):
    # Relationships
    is_paid = models.BooleanField(default="", null=True)
    # service = models.ForeignKey(StoreServices, on_delete=models.CASCADE, null=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    # Fields
    booking_date = models.DateField(null=True, blank=True)
    appointment_status = models.CharField(max_length=30, null=True, default='NOT_ASSIGNED')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.booking_date)+" : "+str(self.customer)


class AppointmentForMultipleService(AuditUuidModelMixin):
    appointment = models.ForeignKey(AppointmentSchedule, on_delete=models.CASCADE, null=True, blank=True)
    assigned_staff = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True)
    # assigned_staff1 = models.CharField(max_length=255,  null=True, blank=True)
    # assigned_staff2 = models.CharField(max_length=255,  null=True, blank=True)
    # assigned_staff3 = models.CharField(max_length=255,  null=True, blank=True)
    # assigned_staff4 = models.CharField(max_length=255,  null=True, blank=True)
    service = models.ForeignKey(StoreServices, on_delete=models.CASCADE, null=True, blank=True)
    start_time = models.CharField(max_length=30, null=True, blank=True)
    end_time = models.CharField(max_length=30, null=True, blank=True)

    class Meta:
        pass

    def __str__(self):
        return "{} - {} - {} - {}".format(self.service, self.assigned_staff, self.start_time, self.end_time)



class Enquiry(AuditUuidModelMixin):
    enquiry_code = models.CharField(max_length=230, default="")
    full_name = models.CharField(max_length=100, default="")
    phone_number = models.CharField(max_length=100, default="")
    service = models.ForeignKey(StoreServices, on_delete=models.CASCADE, null=True)
    customer_email = models.CharField(max_length=100, default="")
    gender = models.CharField(max_length=100, default="")
    locality = models.CharField(max_length=100, default="")
    enquiry_date = models.CharField(max_length=100, default="")
    lead_source = models.CharField(max_length=100, default="")
    enquiry_type = models.CharField(max_length=100, default="")
    date = models.CharField(max_length=100, default="")
    time = models.CharField(max_length=100, default="")
    staff_name = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True)
    message = models.CharField(max_length=100, default="")
    # cold = models.CharField(max_length=100, default="")
    # warm = models.CharField(max_length=100, default="")
    # hot = models.CharField(max_length=100, default="")
    call_log = models.CharField(max_length=100, default="")

    class Meta:
        pass


class MembersDetails(AuditUuidModelMixin):
    members_code = models.CharField(max_length=255, default=None)
    full_name = models.CharField(max_length=255, default=None)
    phone_number = models.CharField(max_length=10, default=None, null=True, unique=True)
    customer_email = models.CharField(max_length=255, default="")
    gender = models.CharField(max_length=255, default="")
    locality = models.CharField(max_length=255, default=None)
    vacinated = models.CharField(max_length=255, default=None)
    lead_source = models.CharField(max_length=255, default=None)
    dob = models.CharField(max_length=255, default=None)
    sales_rep = models.CharField(max_length=255, default=None)
    members_maneger = models.CharField(max_length=255, default=None)
    batch = models.CharField(max_length=255, default=None)
    attendance_id = models.CharField(max_length=255, default=None)
    club_id = models.CharField(max_length=255, default=None)
    gst_no = models.CharField(max_length=255, default=None)
    emergency_ccontact = models.CharField(max_length=255, default=None)
    emergency_number = models.CharField(max_length=255, default=None)
    relationship = models.CharField(max_length=255, default=None)
    notification = models.CharField(max_length=255, default=None)
    sms = models.CharField(max_length=255, default=None)
    email = models.CharField(max_length=255, default=None)
    occupation = models.CharField(max_length=255, default=None)
    offical_mail = models.CharField(max_length=255, default=None)
    company_name = models.CharField(max_length=255, default=None)

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)



class ReportModule(AuditUuidModelMixin):
    report_name = models.CharField(null=False, max_length=100,unique=True)
    report_file_name = models.CharField(null=False, max_length=100)
    params = models.CharField(max_length=1000, null=True, blank=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        permissions = (
            ("can_view_reports", "Can View Reports"),
            # ("can_view_pos_sales_reports", "Can View POS Sales Reports"),
            # ("can_view_online_sales_reports", "Can View Online Sales Reports"),
            # ("can_view_product_list_reports", "Can View Product List Reports"),
            # ("can_view_product_stock_reports", "Can View Product Stock Reports"),
            # ("can_view_overall_sales_reports", "Can View Over All Sales Reports"),
            # ("can_view_barcode_40l_reports", "Can View Barcode 40L Reports"),
        )

    def save(self, *args, **kwargs):
        super(ReportModule, self).save(*args, **kwargs)
        code_name = "can_view_" + str(self.report_name).lower()
        name = "Can View " + str(self.report_name).capitalize()
        ct = ContentType.objects.get_for_model(ReportModule)
        Permission.objects.get_or_create(codename=code_name,
                                  name=name,
                                  content_type=ct)


