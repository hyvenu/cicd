from django.urls import path, include
from rest_framework import routers
from . import views,api

router = routers.DefaultRouter()
router.register("ReportEngineMain",api.ReportListViewSet,basename='Mymodel')
# router.register("first_view",api.BatchListViewSet)


urlpatterns = [
    path("api/v1/", include(router.urls)),
    # path("api/v1/delete_report_data", views.get_report_data, name="get_report_data"),
    path("api/v1/get_report", views.get_report, name="get_report"),
]
