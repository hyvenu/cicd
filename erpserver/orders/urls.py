from django.urls import path, include
from rest_framework import routers
from . import views


urlpatterns = [
    path('api/v1/get_order_list', views.get_order_list, name="get_order_list"),
    path('api/v1/get_order_detail', views.get_order_detail, name="get_order_detail"),
]