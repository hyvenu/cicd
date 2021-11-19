from django.urls import path, include
from rest_framework import routers

from . import views, api

router = routers.DefaultRouter()
router.register("Store", api.StoreViewSet)
router.register("StoreUser", api.StoreUserViewSet)
router.register("Department", api.DepartmentViewSet)
router.register("Designation", api.DesignationViewSet)
router.register("StoreShip", api.StoreShipLocationsViewSet)
router.register("ProductCampaign", api.ProductCampaignsViewSet)
router.register("SiteSettings", api.SiteSettingsViewSet)
router.register("StoreService", api.StoreServicesViewSet)
router.register("Enquiry", api.EnquiryViewSet)
router.register("MembersDetails", api.MembersDetailsViewSet)
router.register("Customer", api.CustomerViewSet)
router.register("Appointment", api.AppointmentScheduleViewSet)
router.register("Employee", api.EmpolyeeViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("Store/", views.StoreListView.as_view(), name="store_list"),
    path("Store/create/", views.StoreCreateView.as_view(), name="store_create"),
    path("Store/detail/<str:pk>/", views.StoreDetailView.as_view(), name="store_detail"),
    path("Store/update/<str:pk>/", views.StoreUpdateView.as_view(), name="store_update"),
    path("Store/select/", views.StoreSelectView.as_view(), name="store_select"),
    path('api/v1/get_site_settings', views.get_site_settings, name="get_site_settings"),
    path('api/v1/get_booking_history', views.get_booking_history, name="get_booking_history"),
    path('api/v1/save_appointment', views.save_Appointment, name="save_appointment"),
    path('api/v1/update_is_paid', views.update_is_paid, name="update_is_paid"),
    path('api/v1/update_advance_amount', views.update_advance_amount, name="update_advance_amount"),
    path('api/v1/get_appointment_list', views.get_appointment_list, name="get_appointment_list"),
    path('api/v1/get_employee_list', views.get_employee_list, name="get_employee_list"),
    path('api/v1/get_enquiry_list', views.get_enquiry_list, name="get_enquiry_list"),
    path('api/v1/get_store_list', views.get_store_list, name="get_store_list"),
    path('api/v1/get_store_service_list', views.get_store_service_list, name="get_store_service_list"),
    path('api/v1/get_store_details', views.get_store_details, name="get_store_details"),
    path('api/v1/get_appointment_details', views.get_appointment_details, name="get_appointment_details"),
    path('api/v1/get_viewbooking_details', views.get_viewbooking_details, name="get_viewbooking_details"),
    path('api/v1/get_dashboard_booking_details', views.get_dashboard_booking_details, name="get_dashboard_booking_details"),
    path('api/v1/get_appointment_details_by_id', views.get_appointment_details_by_id, name="get_appointment_details_by_id"),

)