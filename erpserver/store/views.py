from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.http import HttpResponseRedirect, JsonResponse
from rest_framework.parsers import JSONParser 
from django.shortcuts import render

# Create your views here.
from django.urls import reverse_lazy
from django.views import generic, View
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from view_breadcrumbs import ListBreadcrumbMixin

from . import models
from . import forms
from django.contrib import messages

from . import serializers
from .models import StoreServices, StoreUser
from .service import StoreService


class StoreListView(LoginRequiredMixin, PermissionRequiredMixin, generic.ListView):
    permission_required = ('store.view_store',)
    permission_denied_message = "Access not provided"
    model = models.Store
    form_class = forms.StoreForm
    template_name = 'store_list.html'


class StoreCreateView(PermissionRequiredMixin, LoginRequiredMixin, generic.CreateView):
    model = models.Store
    permission_required = ('store.add_store',)

    def get(self, request, *args, **kwargs):
        context = {'form': forms.StoreForm}
        return render(request, template_name='form_store.html', context=context)

    def post(self, request, *args, **kwargs):
        form = forms.StoreForm(request.POST or None)
        if form.is_valid():
            store = form.save()
            store.save()
            messages.success(request, 'Form submission successful')
            return HttpResponseRedirect(reverse_lazy('Store_create', args=[]))
        return render(request, 'form_store.html', {'form': form})


class StoreDetailView(LoginRequiredMixin, PermissionRequiredMixin, generic.DetailView):
    permission_required = ('store.view_store',)
    model = models.Store
    form_class = forms.StoreForm
    template_name = 'store_detail.html'


class StoreUpdateView(LoginRequiredMixin, PermissionRequiredMixin, generic.UpdateView):
    model = models.Store
    permission_required = ('store.change_store',)
    form_class = forms.StoreForm
    pk_url_kwarg = "pk"
    template_name = 'form_store.html'

    def get_success_url(self):
        return reverse_lazy('store_list')


class StoreSelectView(LoginRequiredMixin, View):
    form_class = forms.StoreForm
    template_name = 'store_select.html'
    store_service = StoreService()

    def get(self, request, *args, **kwargs):
        store_list = self.store_service.get_store_by_user(request.user.id)
        return render(request, self.template_name, {'store_list_object': store_list})

    def post(self, request, *args, **kwargs):
        if 'store_id' in request.POST:
            store_id = request.POST['store_id']
            store_name = request.POST['store_name']
        if store_id is not None:
            request.session['store_id'] = store_id
            request.session['store_name'] = store_name
            # <process form cleaned data>
            return HttpResponseRedirect('/')
        return HttpResponseRedirect(reverse_lazy('store_select'))


class DepartmentView(LoginRequiredMixin, View):
    model = models.Department


@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_site_settings(request):
    store_service = StoreService()
    setting_type = request.query_params['setting_type']
    site_settings = store_service.get_Site_Settings(setting_type)
    return JsonResponse(site_settings, safe=False, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, ])
def delete_booking(request, app_id):
    store_service = StoreService()    
    #pdata = JSONParser().parse(request)
    #pdata = request.data
    print("pdata %s"%app_id)
    #app_id = request.GET.get('app_id')
    #app_id = pdata['app_id']
    count = store_service.delete_appointment(app_id)
    return JsonResponse(count, safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_booking_history(request):
    store_service = StoreService()
    customer_id = request.GET.get('customer_id')
    booking_history = store_service.get_Appointment(customer_id)
    return JsonResponse(booking_history, safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_app_forbill(request, app_id):
    store_service = StoreService()
    #app_id = request.GET.get('app_id')
    booking_history = store_service.get_app_forbill(app_id)
    return JsonResponse(booking_history, safe=False, status=status.HTTP_200_OK)    


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_store_details(request):
    store_service = StoreService()
    store_id = request.query_params['id']
    store_details = store_service.get_store_details(store_id)
    return JsonResponse(store_details, safe=False, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def save_Appointment(request):
    data = request.data
    store_service = StoreService()
    ap_res = store_service.save_Appointment(data)
    return JsonResponse(ap_res, safe=False)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, ])
def update_is_paid(request):
    data = request.data
    store_service = StoreService()
    ap_res = store_service.update_bill(data)
    return JsonResponse(ap_res, safe=False)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, ])
def update_advance_amount(request):
    data = request.data
    store_service = StoreService()
    ap_res = store_service.update_advance_amount(data)
    return JsonResponse(ap_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_appointment_details(request):
    store_service = StoreService()
    app_res = store_service.get_appointment_details()
    return JsonResponse(app_res, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_appointment_details_calendar(request, store_id, date):
    store_service = StoreService()
    app_res = store_service.get_appointment_details_calendar(store_id, date)
    return JsonResponse(app_res, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_store_list(request):
    store_service = StoreService()
    app_res = store_service.get_store_list()
    return JsonResponse(app_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_viewbooking_details(request):
    store_service = StoreService()
    app_res = store_service.get_viewbooking_details()
    return JsonResponse(app_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_all_viewbooking_details(request):
    store_service = StoreService()
    app_res = store_service.get_all_viewbooking_details()
    return JsonResponse(app_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_dashboard_booking_details(request):
    store_service = StoreService()
    app_res = store_service.get_viewbooking_details()
    return JsonResponse(app_res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_appointment_details_by_id(request):
    store_service = StoreService()

    appo_id = request.query_params['id']
    app_id = appo_id.lstrip()
    app_obj = store_service.get_appointment_details_byid(app_id)
    return JsonResponse(app_obj, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_appointment_details_by_customer(request, cust_id):
    store_service = StoreService()
    app_obj = store_service.get_appointment_details_bycustomer(cust_id)
    return JsonResponse(app_obj, safe=False)    


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_appointment_list(request):
    store_service = StoreService()
    appointment_list = store_service.get_appointment_list()
    return JsonResponse(appointment_list, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_store_service_list(request):
    store_service = StoreService()
    store_list = store_service.get_store_service_list()
    return JsonResponse(store_list, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_employee_list(request):
    store_service = StoreService()
    employee_list = store_service.get_employee_list()
    return JsonResponse(employee_list, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_enquiry_list(request):
    store_service = StoreService()
    employee_list = store_service.get_enquiry_list()
    return JsonResponse(employee_list, safe=False)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, ])
def store_services(request):    
  #param1 = request.GET.get("param1")
  if request.method == 'GET':
        print("GET called")
        store_service = StoreService()
        service_list = store_service.get_service_list()
        return JsonResponse(service_list, safe=False)
 
  elif request.method == 'POST':
        print("POST called")
        data = request.data
        store_service = StoreService()
        ap_res = store_service.save_service(data)
        return JsonResponse(ap_res, safe=False)

  elif request.method == 'PUT':
        print("UPDATE CALLED %s"%request.data)
        data = request.data
        store_service = StoreService()
        ap_res = store_service.update_service(data)
        return JsonResponse(ap_res, safe=False)
    
  elif request.method == 'DELETE':
        count = StoreServices.objects.all().delete()
        return JsonResponse({'message': '{} services were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)   

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, ])
def delete_service(request, id):
    store_service = StoreService()   
    print("pdata %s"%id)
    count = store_service.delete_service(id)
    return JsonResponse(count, safe=False, status=status.HTTP_200_OK)         
