from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views import generic
from django_filters.views import FilterView
from django_tables2 import SingleTableView, LazyPaginator, SingleTableMixin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from . import models

# Create your views here.
from .service import PurchaseService


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def save_pr(request):
    data = request.data
    purchase_service = PurchaseService()
    pr_res = purchase_service.save_pr(data)
    return JsonResponse(pr_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_pr_list(request):
    purchase_service = PurchaseService()
    prs = purchase_service.get_pr_list()
    return JsonResponse(prs, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_pr_details(request):
    purchase_service = PurchaseService()
    pr_id = request.query_params['id']
    pr_obj = purchase_service.get_pr_details(pr_id)
    return JsonResponse(pr_obj, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def approve_pr(request):
    pr_service = PurchaseService()
    pr_id = request.data['id']
    approved_by = request.data['approved_by']
    approved_date = request.data['approved_date']
    pr_res = pr_service.approve_pr(request.data)
    return JsonResponse(pr_res, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def delete_prpl(request):
    pr_service = PurchaseService()
    prpl_id = request.data['id']
    res = pr_service.delete_product(prpl_id)
    return JsonResponse(res, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def reject_pr(request):
    pr_service = PurchaseService()
    pr_id = request.data['id']
    approved_by = request.data['approved_by']
    approved_date = request.data['approved_date']
    pr_res = pr_service.reject_pr(request.data)
    return JsonResponse(pr_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_po_details(request):
    purchase_service = PurchaseService()
    po_id = request.query_params['id']
    pr_obj = purchase_service.get_po_details(po_id)
    return JsonResponse(pr_obj, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_po_details_invoice(request):
    purchase_service = PurchaseService()
    po_id = request.query_params['id']
    pr_obj = purchase_service.get_po_details_invoice(po_id)
    return JsonResponse(pr_obj, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_po_list(request):
    purchase_service = PurchaseService()
    po = purchase_service.get_po_list()
    return JsonResponse(po, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def save_po(request):
    data = request.data
    purchase_service = PurchaseService()
    pr_res = purchase_service.save_po(data)
    return JsonResponse(pr_res, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def delete_po_product(request):
    po_service = PurchaseService()
    po_prd_id = request.data['id']
    res = po_service.delete_po_product(po_prd_id)
    return JsonResponse(res, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def save_grn(request):
    data = request.data
    purchase_service = PurchaseService()
    file = request.FILES
    pr_res = purchase_service.save_grn(data, file)
    return JsonResponse(pr_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_grn_details(request):
    purchase_service = PurchaseService()
    grn_id = request.query_params['id']
    grn_obj = purchase_service.get_grn_details(grn_id)
    return JsonResponse(grn_obj, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_grn_list(request):
    purchase_service = PurchaseService()
    grn_list = purchase_service.get_grn_list()
    return JsonResponse(grn_list, safe=False)