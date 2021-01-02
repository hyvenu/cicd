from django.urls import path, include
from rest_framework import routers

from . import api
from . import views

routers = routers.DefaultRouter()
routers.register("VendorMaster", api.VendorMasterViewSet)

urlpatterns = [
    path("api/v1/", include(routers.urls)),
    path("api/v1/get_vendor_code", views.get_product_code, name="get_vendor_code")

]
