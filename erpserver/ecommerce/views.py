import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from ecommerce.service import EcomService
from engine.payment_service import PaymentService
from sales.service import OrderService


@api_view(['POST'])
@permission_classes([AllowAny, ])
def get_product_list(request):
    data = request.data
    ecom_service = EcomService()
    product_list = ecom_service.get_product_list(data)
    return JsonResponse(product_list, safe=False)


def get_category(request):
    ecom_service = EcomService()
    category_list = ecom_service.get_product_category()
    return JsonResponse(category_list, safe=False)


def get_sub_category(request):
    ecom_service = EcomService()
    sub_category_list = ecom_service.get_sub_category()
    return JsonResponse(sub_category_list, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_cart_details(request):
    ecom_service = EcomService()
    cart_list = ecom_service.get_cart_detail(request.user.id)
    return JsonResponse(cart_list, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def add_to_cart(request):
    ecom_service = EcomService()
    data = request.data
    if ecom_service.add_cart(data, request.user.id):
        cart_list = ecom_service.get_cart_detail(request.user.id)
    return JsonResponse(cart_list, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def delete_cart(request):
    ecom_service = EcomService()
    data = request.data
    if ecom_service.delete_cart(data, request.user.id):
        cart_list = ecom_service.get_cart_detail(request.user.id)
        return JsonResponse(cart_list, safe=False)
    else:
        cart_list = ecom_service.get_cart_detail(request.user.id)
        return JsonResponse(cart_list, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def process_checkout(request):
    data = request.data
    order_service = OrderService()
    ecom_service = EcomService()
    user_id = request.user.id
    order_res = order_service.process_order(data, user_id)
    if order_res:
        ecom_service.clear_cart(user_id)
    return JsonResponse(order_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_wish_list(request):
    ecom_service = EcomService()
    wish_list = ecom_service.get_wish_list(request.user.id)
    return JsonResponse(wish_list, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def add_to_wish_list(request):
    ecom_service = EcomService()
    data = request.data
    if ecom_service.add_wish_list(data, request.user.id):
        wish_list = ecom_service.get_wish_list(request.user.id)
    return JsonResponse(wish_list, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def delete_wish_list(request):
    ecom_service = EcomService()
    data = request.data
    if ecom_service.delete_wish_list(data, request.user.id):
        wish_list = ecom_service.get_wish_list(request.user.id)
        return JsonResponse(wish_list, safe=False)
    else:
        wish_list = ecom_service.get_wish_list(request.user.id)
        return JsonResponse(wish_list, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_order_amount(request):
    order_service = OrderService()
    if 'order_id' in request.query.params:
        order_id = request.query.params['order_id']
        order_data = order_service.get_order_amount(order_id)
        return JsonResponse(order_data, safe=False)
    else:
        return JsonResponse("Order Not Found", safe=False, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def verify_payment(request):
    payment = PaymentService()
    data = request.data
    res = payment.verify_payment(data)
    return JsonResponse(res, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def get_order_list(request):
    order_service = OrderService()
    data = request.data
    if data is not None:
        orders = order_service.get_orders(data)
        return JsonResponse(list(orders), safe=False)
    else:
        return JsonResponse("Not Criteria Found", safe=False, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_order_detail(request):
    order_service = OrderService()
    order_id = request.query_params['id']
    orders_detail = order_service.get_order_details(order_id)
    return JsonResponse(list(orders_detail), safe=False)



@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_invoice_pdf(request):
    order_service = OrderService()
    order_id = request.query_params['order_number']
    orders_detail = order_service.get_pdf_invoice(order_id)
    if orders_detail:
        return FileResponse(open(orders_detail, 'rb'), content_type='application/pdf')
    else:
        return JsonResponse('Error while downloading invoice file', safe=False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)