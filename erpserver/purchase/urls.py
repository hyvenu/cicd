from django.urls import path, include
from rest_framework import routers

# from . import api
from . import views, api

routers = routers.DefaultRouter()
routers.register("order_request", api.POOrderRequestViewSet)

urlpatterns = [
    path("api/v1/po/", include(routers.urls)),
    # path("api/v1/get_pr_code", views.get_pr_code, name="get_pr_code")
    path('api/v1/save_pr', views.save_pr, name="save_pr_data"),
    path('api/v1/get_pr_list', views.get_pr_list, name="get_pr_list"),
    path('api/v1/get_pr_details', views.get_pr_details, name="get_pr_details"),

    path('api/v1/approve_pr', views.approve_pr, name="approve"),
    path('api/v1/reject_pr', views.reject_pr, name="reject"),
    path('api/v1/delete_prpl', views.delete_prpl, name="delete_prpl"),

    path('api/v1/save_po', views.save_po, name="save_po_data"),
    path('api/v1/get_po_list', views.get_po_list, name="get_po_list"),
    path('api/v1/get_po_details', views.get_po_details, name="get_po_details"),
    path('api/v1/get_po_details_invoice', views.get_po_details_invoice, name="get_po_details_invoice"),
    path('api/v1/delete_po_product', views.delete_po_product, name="delete_po_product"),
    path('api/v1/save_grn', views.save_grn, name="save_grn"),
    path('api/v1/get_grn_details', views.get_grn_details, name="get_grn_details"),
    path('api/v1/get_grn_list', views.get_grn_list, name="get_grn_list"),


]
