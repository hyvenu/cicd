from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
# Create your models here.
# from viewflow.models import Process

from audit_fields.models import AuditUuidModelMixin
from inventory.models import ProductMaster, ProductPriceMaster, UnitMaster
from security.models import CustomerAddress
from store.models import Store, StoreServices, Customer, AppointmentSchedule

User = get_user_model()


class OrderRequest(AuditUuidModelMixin):
    order_raised_date = models.DateTimeField(null=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE,default="")
    order_number = models.CharField(max_length=20, unique=True, null=True)
    order_status = models.IntegerField(null=True)
    shipping_address = models.ForeignKey(CustomerAddress, on_delete=models.CASCADE, null=True,
                                         related_name="shipping_address")
    billing_address = models.ForeignKey(CustomerAddress, on_delete=models.CASCADE, null=True,
                                        related_name="billing_address")
    invoice_no = models.CharField(max_length=255, unique=True, blank=True, null=True)
    payment_method = models.CharField(max_length=50)
    delivery_method = models.CharField(max_length=50)
    order_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)

    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    promo_code = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        pass

    def __str__(self):
        return self.pk + '/' + self.customer + '/' + str(self.order_status)


class OrderDetails(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE, default="")
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, null=True)
    pack_unit = models.ForeignKey(ProductPriceMaster, on_delete=models.CASCADE, null=True)
    service_name = models.CharField(max_length=255, null=True)
    service_id = models.CharField(max_length=255, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=1)
    quantity = models.IntegerField(default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    sub_total = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    batch_expiry = models.DateField(null=True, blank=True)
    batch_number = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        pass


class OrderEvents(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE,default="")
    event_date = models.DateTimeField(null=True, blank=True)
    order_status = models.IntegerField(default=0, null=True)
    description = models.CharField(max_length=2000, null=True, default=None)

    class Meta:
        pass


class SalesOrderRequest(AuditUuidModelMixin):
    po_type = models.CharField(max_length=50, default="", null=True)
    po_number = models.CharField(max_length=255, unique=True, null=True)
    po_raised_by = models.CharField(max_length=500, null=True, blank=None)
    po_date = models.DateTimeField(default=None, null=True)
    shipping_address = models.CharField(max_length=2000, null=True)
    payment_terms = models.CharField(max_length=200, null=True)
    upi_type = models.CharField(max_length=200, null=True)
    credit_type = models.CharField(max_length=200,null=True, default=None)
    split_type = models.CharField(max_length=200,null=True, default=None)
    transport_type = models.CharField(max_length=200, null=True)
    payment_terms = models.CharField(max_length=200, null=True)
    other_reference = models.CharField(max_length=2000, null=True)
    terms_of_delivery = models.CharField(max_length=2000, null=True)
    note = models.CharField(max_length=2000, null=True)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packing_perct = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packing_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=10, decimal_places=1, default=0,null=True)
    cgst = models.DecimalField(max_digits=10, decimal_places=1, default=0,null=True)
    igst = models.DecimalField(max_digits=10, decimal_places=1, default=0,null=True)

    # invoice_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    terms_conditions = models.CharField(max_length=2000, null=True)
    store = models.ForeignKey(Store, null=True, on_delete=models.CASCADE, related_name="store_sales_req")
    discount_price = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    grand_total = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    advance_amount = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    amount = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    change = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    balance_amount = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    # card = models.BooleanField(default=False, null=True)
    # cash = models.BooleanField(default=False, null=True)
    # upi = models.BooleanField(default=False, null=True)
    transaction_id = models.CharField(max_length=255, null=True, default=None)

    # subtotal_product_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    exchange = models.BooleanField(default=True, null=True)
    cancel_invoice = models.BooleanField(default=True, null=True)
    refund = models.BooleanField(default=True, null=True)
    user_id = models.CharField(max_length=255, null=True, default=None)
    supervisor_id = models.CharField(max_length=255, null=True, default=None)
    card_no = models.IntegerField(null=True, default=0)
    invoice_no = models.CharField(max_length=250, default="")
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, default=None)
    total_gst_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    total_include_gst = models.DecimalField(max_digits=10, decimal_places=1, default=0)

    def __str__(self):
        return self.po_number


class SalesOrderDetails(AuditUuidModelMixin):
    po_order = models.ForeignKey(SalesOrderRequest, on_delete=models.CASCADE, default=None, null=True)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, null=True)
    service = models.ForeignKey(StoreServices, on_delete=models.CASCADE, null=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, default=None, null=True)

    booking = models.ForeignKey(AppointmentSchedule, on_delete=models.CASCADE, default=None, null=True)
    # product_code = models.CharField(max_length=50, null=True, default=None)
    product_name = models.CharField(max_length=255, null=True, default=None)
    unit = models.ForeignKey(UnitMaster, on_delete=models.CASCADE, null=True)
    qty = models.IntegerField(null=True)
    unit_text = models.CharField(max_length=1000, null=True)
    # delivery_date = models.DateField(null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    discount_price = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    gst = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    barcode = models.CharField(max_length=500, null=True)
    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    # amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # disc_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    therapist1 = models.CharField(max_length=255, null=True, default=None)
    therapist2 = models.CharField(max_length=255, null=True, default=None)
    therapist3 = models.CharField(max_length=255, null=True, default=None)
    therapist4 = models.CharField(max_length=255, null=True, default=None)
    # total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        pass


class SalesRefund(AuditUuidModelMixin):
    # po_type = models.CharField(max_length=50, default="", null=True)
    refund_number = models.CharField(max_length=255, unique=True, null=True)
    # po_raised_by = models.CharField(max_length=500, null=True, blank=None)
    refund_date = models.DateTimeField(default=None, null=True)
    shipping_address = models.CharField(max_length=2000, null=True)
    transport_type = models.CharField(max_length=200, null=True)
    payment_terms = models.CharField(max_length=200, null=True)
    upi_type = models.CharField(max_length=200, null=True)
    other_reference = models.CharField(max_length=2000, null=True)
    terms_of_delivery = models.CharField(max_length=2000, null=True)
    note = models.CharField(max_length=2000, null=True)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packing_perct = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packing_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    igst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # invoice_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    terms_conditions = models.CharField(max_length=2000, null=True)
    store = models.ForeignKey(Store, null=True, on_delete=models.CASCADE, related_name="store_refund_req")
    discount_price = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    grand_total = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    # card = models.BooleanField(default=False, null=True)
    # cash = models.BooleanField(default=False, null=True)
    # upi = models.BooleanField(default=False, null=True)
    transaction_id = models.CharField(max_length=255, null=True, default=None)
    # subtotal_product_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    exchange = models.BooleanField(default=True, null=True)
    cancel_invoice = models.BooleanField(default=True, null=True)
    refund_amount = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    user_id = models.CharField(max_length=255, null=True, default=None)
    supervisor_id = models.CharField(max_length=255, null=True, default=None)
    invoice_no = models.ForeignKey(SalesOrderRequest, on_delete=models.CASCADE,null=True, blank=True, default=None)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE,null=True, blank=True, default=None)
    total_gst_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    total_include_gst = models.DecimalField(max_digits=10, decimal_places=1, default=0)

    def __str__(self):
        return self.refund_number


class SalesRefundDetails(AuditUuidModelMixin):
    refund_order = models.ForeignKey(SalesRefund, on_delete=models.CASCADE, default=None, null=True)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, null=True)
    service = models.ForeignKey(StoreServices, on_delete=models.CASCADE, null=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, default=None, null=True)
    # product_code = models.CharField(max_length=50, null=True, default=None)
    # product_name = models.CharField(max_length=255, null=True, default=None)
    unit = models.ForeignKey(UnitMaster, on_delete=models.CASCADE, null=True)
    qty =models.DecimalField(max_digits=10, decimal_places=1, default=0)
    unit_text = models.CharField(max_length=1000, null=True)
    # delivery_date = models.DateField(null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    discount_price = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    gst = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    barcode = models.CharField(max_length=500, null=True)
    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    # amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # disc_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)


    # total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        pass



class SalesExchange(AuditUuidModelMixin):
    # po_type = models.CharField(max_length=50, default="", null=True)
    exchange_number = models.CharField(max_length=255, unique=True, null=True)
    # po_raised_by = models.CharField(max_length=500, null=True, blank=None)
    exchange_date = models.DateTimeField(default=None, null=True)
    shipping_address = models.CharField(max_length=2000, null=True)
    transport_type = models.CharField(max_length=200, null=True)
    payment_terms = models.CharField(max_length=200, null=True)
    upi_type = models.CharField(max_length=200, null=True)
    other_reference = models.CharField(max_length=2000, null=True)
    terms_of_delivery = models.CharField(max_length=2000, null=True)
    note = models.CharField(max_length=2000, null=True)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packing_perct = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packing_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    igst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # invoice_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    terms_conditions = models.CharField(max_length=2000, null=True)
    store = models.ForeignKey(Store, null=True, on_delete=models.CASCADE, related_name="store_Exchange_req")
    discount_price = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    grand_total = models.DecimalField(max_digits=30, decimal_places=2, default=0)
    # card = models.BooleanField(default=False, null=True)
    # cash = models.BooleanField(default=False, null=True)
    # upi = models.BooleanField(default=False, null=True)
    transaction_id = models.CharField(max_length=255, null=True, default=None)
    # subtotal_product_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    exchange = models.BooleanField(default=True, null=True)
    cancel_invoice = models.BooleanField(default=True, null=True)
    # refund_amount = models.DecimalField(max_digits=30, decimal_places=1, default=0)
    user_id = models.CharField(max_length=255, null=True, default=None)
    supervisor_id = models.CharField(max_length=255, null=True, default=None)
    invoice_no = models.ForeignKey(SalesOrderRequest, on_delete=models.CASCADE,null=True, blank=True, default=None)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE,null=True, blank=True, default=None)
    total_gst_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    total_include_gst = models.DecimalField(max_digits=10, decimal_places=1, default=0)

    def __str__(self):
        return self.exchange_number


class SalesExchangeDetails(AuditUuidModelMixin):
    exchange_order = models.ForeignKey(SalesExchange, on_delete=models.CASCADE, default=None, null=True)
    product = models.ForeignKey(ProductMaster, on_delete=models.CASCADE, null=True)
    service = models.ForeignKey(StoreServices, on_delete=models.CASCADE, null=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, default=None, null=True)
    # product_code = models.CharField(max_length=50, null=True, default=None)
    # product_name = models.CharField(max_length=255, null=True, default=None)
    unit = models.ForeignKey(UnitMaster, on_delete=models.CASCADE, null=True)
    qty = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    unit_text = models.CharField(max_length=1000, null=True)
    # delivery_date = models.DateField(null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    discount_price = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    gst = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    barcode = models.CharField(max_length=500, null=True)
    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    # amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # disc_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=1, default=0)


    # total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        pass
