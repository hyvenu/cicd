from django.urls import path, include
from rest_framework import routers

from . import views, api

router = routers.DefaultRouter()
router.register("Store", api.StoreViewSet)
router.register("StoreUser", api.StoreUserViewSet)
router.register("Department", api.DepartmentViewSet)
router.register("StoreShip", api.StoreShipLocationsViewSet)
router.register("ProductCampaign", api.ProductCampaignsViewSet)
router.register("SiteSettings", api.SiteSettingsViewSet)
router.register("StoreService", api.StoreServicesViewSet)
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
)