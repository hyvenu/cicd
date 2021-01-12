from django.urls import path, include
from rest_framework import routers

from . import api
from . import views

routers = routers.DefaultRouter()
routers.register("PurchaseRequisition", api.PurchaseRequisitionViewSet)

urlpatterns = [
    path("api/v1/", include(routers.urls)),
    # path("api/v1/get_pr_code", views.get_pr_code, name="get_pr_code")
]
