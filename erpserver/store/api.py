from django.http import JsonResponse
from rest_framework import viewsets, permissions

from . import serializers
from . import models


class StoreViewSet(viewsets.ModelViewSet):
    """ViewSet for the Store class"""

    queryset = models.Store.objects.all()
    serializer_class = serializers.StoreSerializer


class StoreUserViewSet(viewsets.ModelViewSet):
    """ViewSet for the Store class"""

    queryset = models.StoreUser.objects.all()
    serializer_class = serializers.StoreUserSerializer

    def get_queryset(self):
        if 'query' in self.request.query_params['query'] and self.request.query_params['query'] == 'all':
            return models.StoreUser.objects.all()
        else:
            return models.StoreUser.objects.filter(user_id=self.request.user.id).all()


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = models.Department.objects.all()
    serializer_class = serializers.DepartmentSerializer

class DesignationViewSet(viewsets.ModelViewSet):
    queryset = models.Designation.objects.all()
    serializer_class = serializers.DesignationSerializer


class StoreShipLocationsViewSet(viewsets.ModelViewSet):
    queryset = models.StoreShipLocations.objects.all()
    serializer_class = serializers.StoreShipLocationsSerializer

    def get_queryset(self):
        if 'store_id' in self.request.query_params:
            return models.StoreShipLocations.objects.filter(store_id=self.request.query_params['store_id']).all()
        else:
            return models.StoreShipLocations.objects.all()


class ProductCampaignsViewSet(viewsets.ModelViewSet):
    queryset = models.ProductCampaigns.objects.all()
    serializer_class = serializers.ProductCampaignsSerializer

class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = models.SiteSettings.objects.all()
    serializer_class = serializers.SiteSettingsSerializer

class StoreServicesViewSet(viewsets.ModelViewSet):
    queryset = models.StoreServices.objects.all()
    serializer_class = serializers.StoreServiceSerializer

class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = models.Enquiry.objects.all()
    serializer_class = serializers.EnquirySerializer



class CustomerViewSet(viewsets.ModelViewSet):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer

class AppointmentScheduleViewSet(viewsets.ModelViewSet):
    queryset = models.AppointmentSchedule.objects.all()
    serializer_class = serializers.AppointmentScheduleSerializer

class EmpolyeeViewSet(viewsets.ModelViewSet):
    queryset = models.Employee.objects.all()
    serializer_class = serializers.EmployeeSerializer


class MembersDetailsViewSet(viewsets.ModelViewSet):
    queryset = models.MembersDetails.objects.all()
    serializer_class = serializers.MembersDetailsSerializer

class AppSettingViewSet(viewsets.ModelViewSet):
    queryset = models.AppSettings.objects.all()
    serializer_class = serializers.AppSettingsSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        settings_dict = {}
        for item in serializer.data:
            settings_dict[item['app_key']] = item['app_value']
        return JsonResponse(settings_dict,safe=False)


class ReportModuleViewSet(viewsets.ModelViewSet):
    queryset = models.ReportModule.objects.filter(is_active=True).all()
    serializer_class = serializers.ReportModuleSerializer

    def get_queryset(self):
        perm = self.request.user.get_all_permissions()
        perm = [ str(i.split(".")[1]).replace("can_view_","") for i in list(perm)]
        if 'is_active' in self.request.query_params:
            return models.ReportModule.objects.filter(report_name__in=perm,is_active=int(self.request.query_params['is_active'])).all()
        else:
            return models.ReportModule.objects.filter(report_name__in=perm).all()

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = models.SubscriptionDetails.objects.all()
    serializer_class = serializers.SubscriptionSerializer