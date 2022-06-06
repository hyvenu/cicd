from django.urls import path, include
from rest_framework import routers
from . import views


router = routers.DefaultRouter()

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path('api/v1/get_po_list', views.get_po_list, name="get_po_list"),
    path('api/v1/get_grn_list', views.get_grn_list, name="get_grn_list"),
    path('api/v1/get_monthly_sales_list', views.get_monthly_sales_list, name="get_monthly_sales_list"),
    path('api/v1/get_monthly_purchase_list', views.get_monthly_purchase_list, name="get_monthly_purchase_list"),
    path('api/v1/get_monthly_expense_list', views.get_monthly_expense_list, name="get_monthly_expense_list"),
    path('api/v1/get_daily_status', views.get_daily_status, name="get_daily_status"),
    
    path('api/v1/get_dashboard_booking_details', views.get_dashboard_booking_details, name="get_dashboard_booking_details"),


)