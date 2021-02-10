from django.urls import path

from . import views

urlpatterns = [
    path('api/v1/get_products', views.get_product_list, name="ecom_product_list"),
    path('api/v1/get_category', views.get_category, name="ecom_category"),
    path('api/v1/get_sub_category', views.get_sub_category, name="ecom_sub_category"),
    path('api/v1/add_cart', views.add_to_cart, name="ecom_add_cart"),
    path('api/v1/get_cart', views.get_cart_details, name="ecom_get_cart"),
    path('api/v1/delete_cart', views.delete_cart, name="ecom_delete_cart"),
    path('api/v1/proceed_checkout', views.process_checkout, name="checkout"),
    path('api/v1/add_wish_list', views.add_to_wish_list, name="ecom_add_wish_list"),
    path('api/v1/get_wish_list', views.get_wish_list, name="get_wish_list"),
    path('api/v1/delete_wish_list', views.delete_wish_list, name="ecom_delete_wish_list"),
    path('api/v1/get_order_amount', views.get_order_amount, name="ecom_get_order_amount"),
    path('api/v1/verify_payment', views.verify_payment, name="verify_payment"),
    path('api/v1/get_order_list', views.get_order_list, name="get_order_list"),
    path('api/v1/get_order_detail', views.get_order_detail, name="get_order_detail"),
    path('api/v1/get_invoice_pdf', views.get_invoice_pdf, name="get_invoice_pdf"),
    path('api/v1/check_promo_code', views.check_promo_code, name="check_promo_code"),
]