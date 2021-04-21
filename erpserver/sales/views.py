from django.http import JsonResponse, FileResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import status
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


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def update_order_status(request):
    try:
        order_service = OrderService()
        order_id = request.query_params['id']
        order_status = request.query_params['order_status']
        orders_detail = order_service.update_order(order_id, order_status)
        return JsonResponse(list(orders_detail), safe=False)
    except Exception as e:
        return JsonResponse(str(e), safe=False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_po_details(request):
    purchase_service = OrderService()
    po_id = request.query_params['id']
    pr_obj = purchase_service.get_po_details(po_id)
    return JsonResponse(pr_obj, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_po_list(request):
    purchase_service = OrderService()
    po = purchase_service.get_po_list()
    return JsonResponse(po, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def save_po(request):
    data = request.data
    purchase_service = OrderService()
    pr_res = purchase_service.save_sales_order(data)
    return JsonResponse(pr_res, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def delete_po_product(request):
    po_service = OrderService()
    po_prd_id = request.data['id']
    res = po_service.delete_po_product(po_prd_id)
    return JsonResponse(res, safe=False)