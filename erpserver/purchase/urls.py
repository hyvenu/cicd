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
]
