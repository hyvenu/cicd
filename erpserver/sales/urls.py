from django.urls import path, include
from rest_framework import routers
from . import views


urlpatterns = [
    path('api/v1/get_order_list', views.get_order_list, name="get_order_list"),
    path('api/v1/get_order_detail', views.get_order_detail, name="get_order_detail"),
    path('api/v1/update_order_status', views.update_order_status, name="update_order_status"),
    path('api/v1/get_invoice_pdf', views.get_invoice_pdf, name="get_invoice_pdf"),

    path('api/v1/save_sales_refund', views.save_sales_refund, name="save_refund_data"),
    path('api/v1/save_sales_exchange', views.save_sales_exchange, name="save_exchange_data"),

    path('api/v1/get_pos_list', views.get_pos_list, name="get_pos_list"),

    path('api/v1/save_po', views.save_po, name="save_po_data"),
    path('api/v1/get_po_list', views.get_po_list, name="get_po_list"),
    path('api/v1/get_po_details', views.get_po_details, name="get_po_details"),
    path('api/v1/delete_po_product', views.delete_po_product, name="delete_po_product"),

]