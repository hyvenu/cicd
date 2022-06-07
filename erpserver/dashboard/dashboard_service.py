from django.shortcuts import render

# Create your views here.
from django.db.models import Sum, DateField
from django.db.models.functions import ExtractMonth, Cast

from engine.db_service import custom_sql
from purchase.models import POOrderRequest,GRNMaster
from sales.models import SalesOrderRequest, SalesOrderDetails
from store.models import Customer, AppointmentSchedule, AppointmentForMultipleService
import datetime
import calendar
from uuid import UUID
#from utils import uuid_to_hex

class DashboardService:

    @classmethod
    def get_po_list(cls):
        po_data_list = POOrderRequest.objects.all().values(
            "po_number",
            "vendor__vendor_name",
            "invoice_amount",
        ).order_by('-created')[:10]
        return list(po_data_list)

    @classmethod
    def get_grn_list(cls):
        grn_data_list = GRNMaster.objects.all().values(
            'id',
            'grn_code',
            'po_number',
            'vendor_name',
            'grand_total',
        ) .order_by('-created')[:10]
        return list(grn_data_list)

    @classmethod
    def get_monthly_sales(cls,bid):
        monthly_list = SalesOrderRequest.objects.filter(store_id = bid).values("po_date").\
            annotate(month=ExtractMonth(Cast("po_date",DateField()))).\
            values('month').order_by('month').\
            annotate(total_sales=Sum("grand_total"))
        return list(monthly_list)


    @classmethod
    def get_monthly_purchase(cls,bid):
        monthly_list = GRNMaster.objects.filter(store_id = bid).values("invoice_date").\
            annotate(month=ExtractMonth(Cast("invoice_date",DateField()))).\
            values('month').order_by('month').\
            annotate(total_purchase=Sum("grand_total"))
        return list(monthly_list)

    @classmethod
    def get_daily_status(cls, bid):
        current_date = datetime.datetime.today()
        daily_status ={}
        no_of_customers = Customer.objects.filter().all().count()
        no_of_orders = AppointmentSchedule.objects.filter(store_id = bid).all().count()
        no_of_orders_today = AppointmentSchedule.objects.filter(store_id = bid, booking_date=current_date).count()
        totals_sales_today = SalesOrderRequest.objects.filter(store_id = bid, po_date__date=current_date).all().\
            aggregate(total_sales=Sum("grand_total"))
        #print("SALES",totals_sales_today)
        if totals_sales_today['total_sales'] is not None:
            totals_sales_today = str(totals_sales_today['total_sales'])
        else:
            totals_sales_today = 0
        #print("SALES",totals_sales_today)
        daily_status= dict(
            no_of_customers=no_of_customers,
            no_of_orders=no_of_orders,
            no_of_orders_today=no_of_orders_today,
            totals_sales_today=totals_sales_today
        )
        return daily_status

    # @classmethod
    # def get_dashboard_sales_details(cls):

    #     today = datetime.date.today()

    #     currentMonth = (today.month - 1)
    #     currentYear = today.year

    #     last_day = calendar.monthrange(currentYear, currentMonth)
    #     # print("Last day of month===",last_day)

    #     f_date = str(currentYear) + '-' + str(currentMonth) + '-01'
    #     t_date = str(currentYear) + '-' + str(currentMonth) + '-' + str(last_day[1])

    #     # print("f_date===",f_date)
    #     # print("t_date===",t_date)

    #     sales_list = SalesOrderRequest.objects.raw('select id, sum(grand_total) as grand_total,'
    #                                             'date(po_date) as pdate '
    #                                             'from sales_salesorderrequest '
    #                                             'where po_date >= "' + f_date + '" and po_date <= "' + t_date + '" '
    #                                             'group by pdate')

    #     # for item in sales_list:
    #     #     print("data===",item.grand_total,item.pdate)

    #     final_list = []
    #     for item in sales_list:
    #         dict_obj = dict(
    #             id = item.id,
    #             grand_total = item.grand_total,
    #             date = item.pdate
    #         )
    #         final_list.append(dict_obj)

    #     return final_list

    @classmethod
    def get_dashboard_viewbooking_details(cls,branch_id):
        # print("GET BOOKINGS")
        final_list = []
        if branch_id:
            app_list_object = AppointmentSchedule.objects.filter(is_paid=True,store_id=branch_id)
        else:
            app_list_object = AppointmentSchedule.objects.filter(is_paid=True)

        app_data_list = custom_sql('SELECT a.service_id,'
            'COUNT(a.id) FROM store_appointmentformultipleservice as a, store_appointmentschedule as b'
            ' where b.store_id="'+UUID(branch_id).hex+'" AND a.appointment_id = b.id'
            ' GROUP BY a.service_id ORDER BY COUNT(a.id) DESC LIMIT 10')

        for item in app_data_list:
            service_obj = SalesOrderDetails.objects.filter(service_id=item['service_id']).all().values('product_name')[0]
            prc_value = SalesOrderDetails.objects.filter(service_id=item['service_id']).aggregate(
                amount=Sum('subtotal_amount'))
            if prc_value['amount'] is None:
                prc_value['amount'] = 0
            dict_obj = dict(
                id = "",
                service_id = item['service_id'],
                service_name = service_obj['product_name'],
                price_value = prc_value['amount']

            )
            final_list.append(dict_obj)

        return final_list