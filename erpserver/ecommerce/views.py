import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from ecommerce.service import EcomService


@api_view(['POST'])
@permission_classes([AllowAny,])
def get_product_list(request):
    data = request.data
    ecom_service = EcomService()
    product_list = ecom_service.get_product_list(data)
    return JsonResponse(product_list, safe=False)

def get_category(request):
    ecom_service = EcomService()
    category_list = ecom_service.get_product_category()
    return JsonResponse(category_list,safe=False)

def get_sub_category(request):
    ecom_service = EcomService()
    sub_category_list = ecom_service.get_sub_category()
    return  JsonResponse(sub_category_list,safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def get_cart_details(request):
    ecom_service = EcomService()
    cart_list = ecom_service.get_cart_detail(request.user.id)
    return JsonResponse(cart_list,safe=True)


@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def add_to_cart(request):
    ecom_service = EcomService()
    data = request.data
    if ecom_service.add_cart(data,request.user.id):
        cart_list = ecom_service.get_cart_detail(request.user.id)
    return JsonResponse(cart_list,safe=False)


