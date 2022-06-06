
from django.http import HttpResponse, JsonResponse


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


from .dashboard_service import DashboardService
# Create your views here.



@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_po_list(request):
    dashboard_service = DashboardService()
    po = dashboard_service.get_po_list()
    return JsonResponse(po, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_grn_list(request):
    dashboard_service = DashboardService()
    grn=dashboard_service.get_grn_list()
    return JsonResponse(grn, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_monthly_sales_list(request):
    dashboard_service = DashboardService()
    if "b_id" in request.query_params:
        branch_id = request.query_params["b_id"]
    else:
        branch_id = None
    sales=dashboard_service.get_monthly_sales(branch_id)
    return JsonResponse(sales, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_monthly_purchase_list(request):
    dashboard_service = DashboardService()
    if "b_id" in request.query_params:
        branch_id = request.query_params["b_id"]
    else:
        branch_id = None
    sales=dashboard_service.get_monthly_purchase(branch_id)
    return JsonResponse(sales, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_monthly_expense_list(request):
    dashboard_service = DashboardService()
    sales=dashboard_service.get_monthly_expense()
    return JsonResponse(sales, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_daily_status(request):
    dashboard_service = DashboardService()
    if "b_id" in request.query_params:
        branch_id = request.query_params["b_id"]
    else:
        branch_id = None
    status=dashboard_service.get_daily_status(branch_id)
    return JsonResponse(status, safe=False) 

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_dashboard_booking_details(request):
    dashboard_service = DashboardService()
    if "b_id" in request.query_params:
        branch_id = request.query_params["b_id"]
    else:
        branch_id = None
    app_res = dashboard_service.get_dashboard_viewbooking_details(branch_id)
    return JsonResponse(app_res, safe=False)       