from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated

from vendor.service import VendorService
from django.http import HttpResponse, JsonResponse
from django.views import generic
from . import models
from . import forms


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def get_product_code(request):
    vendor_type = request.data['vendor_type']
    inventory_service = VendorService()
    code = inventory_service.generate_vendor_code(vendor_type)
    return JsonResponse(code, safe=False)


class VendorMasterCreateView(generic.CreateView):
    model = models.VendorMaster
