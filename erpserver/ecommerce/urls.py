from django.urls import path

from . import views

urlpatterns = [
    path('api/v1/get_products', views.get_product_list, name="ecom_product_list"),
    path('api/v1/get_category', views.get_category, name="ecom_category"),
    path('api/v1/get_sub_category', views.get_sub_category, name="ecom_sub_category"),
    path('api/v1/add_cart', views.add_to_cart, name="ecom_add_cart"),
]