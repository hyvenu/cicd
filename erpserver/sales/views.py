from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from sales.service import OrderService


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def process_checkout(request):
    data = request.data
    order_service = OrderService()
    order_res = order_service.process_order(data)
    return JsonResponse(order_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_order_list(request):
    order_service = OrderService()
    orders = order_service.get_orders(1)
    return JsonResponse(list(orders), safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_order_detail(request):
    order_service = OrderService()
    order_id = request.query_params['id']
    orders_detail = order_service.get_order_details(order_id)
    return JsonResponse(list(orders_detail), safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def update_order_status(request):
    order_service = OrderService()
    order_id = request.query_params['id']
    orders_detail = order_service.update_order(order_id)
    return JsonResponse(list(orders_detail), safe=False)
