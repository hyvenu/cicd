from django.urls import path, include
from rest_framework import routers

from . import api
from . import views


router = routers.DefaultRouter()
router.register("ProductPriceMaster", api.ProductPriceMasterViewSet)
router.register("ProductBrandMaster", api.ProductBrandMasterViewSet)
router.register("UnitMaster", api.UnitMasterViewSet)
router.register("ProductSubCategory", api.ProductSubCategoryViewSet)
router.register("ProductMaster", api.ProductMasterViewSet)
router.register("ProductCategory", api.ProductCategoryViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("inventory/dashboard",views.inventory_dashboard, name="inventory_dashboard"),

    path('inventory/ProductMaster/get_product_code', views.get_product_code, name="get_product_code"),

    path("inventory/ProductPriceMaster/", views.ProductPriceMasterListView.as_view(), name="inventory_ProductPriceMaster_list"),
    path("inventory/ProductPriceMaster/create/", views.ProductPriceMasterCreateView.as_view(), name="inventory_ProductPriceMaster_create"),
    path("inventory/ProductPriceMaster/detail/<str:pk>/", views.ProductPriceMasterDetailView.as_view(), name="inventory_ProductPriceMaster_detail"),
    path("inventory/ProductPriceMaster/update/<str:pk>/", views.ProductPriceMasterUpdateView.as_view(), name="inventory_ProductPriceMaster_update"),

    path("inventory/ProductBrandMaster/", views.ProductBrandMasterListView.as_view(), name="inventory_ProductBrandMaster_list"),
    path("inventory/ProductBrandMaster/create/", views.ProductBrandMasterCreateView.as_view(), name="inventory_ProductBrandMaster_create"),
    path("inventory/ProductBrandMaster/detail/<str:pk>/", views.ProductBrandMasterDetailView.as_view(), name="inventory_ProductBrandMaster_detail"),
    path("inventory/ProductBrandMaster/update/<str:pk>/", views.ProductBrandMasterUpdateView.as_view(), name="inventory_ProductBrandMaster_update"),

    path("inventory/UnitMaster/", views.UnitMasterListView.as_view(), name="inventory_UnitMaster_list"),
    path("inventory/UnitMaster/create/", views.UnitMasterCreateView.as_view(), name="inventory_UnitMaster_create"),
    path("inventory/UnitMaster/detail/<str:pk>/", views.UnitMasterDetailView.as_view(), name="inventory_UnitMaster_detail"),
    path("inventory/UnitMaster/update/<str:pk>/", views.UnitMasterUpdateView.as_view(), name="inventory_UnitMaster_update"),

    path("inventory/ProductSubCategory/", views.ProductSubCategoryListView.as_view(), name="inventory_ProductSubCategory_list"),
    path("inventory/ProductSubCategory/create/", views.ProductSubCategoryCreateView.as_view(), name="inventory_ProductSubCategory_create"),
    path("inventory/ProductSubCategory/detail/<str:pk>/", views.ProductSubCategoryDetailView.as_view(), name="inventory_ProductSubCategory_detail"),
    path("inventory/ProductSubCategory/update/<str:pk>/", views.ProductSubCategoryUpdateView.as_view(), name="inventory_ProductSubCategory_update"),

    path("inventory/ProductMaster/", views.ProductMasterListView.as_view(), name="inventory_ProductMaster_list"),
    path("inventory/ProductMaster/create/", views.ProductMasterCreateView.as_view(), name="inventory_ProductMaster_create"),
    path("inventory/ProductMaster/detail/<str:pk>/", views.ProductMasterDetailView.as_view(), name="inventory_ProductMaster_detail"),
    path("inventory/ProductMaster/update/<str:pk>/", views.ProductMasterUpdateView.as_view(), name="inventory_ProductMaster_update"),

    path("inventory/ProductCategory/", views.ProductCategoryListView.as_view(), name="inventory_ProductCategory_list"),
    path("inventory/ProductCategory/create/", views.ProductCategoryCreateView.as_view(), name="inventory_ProductCategory_create"),
    path("inventory/ProductCategory/detail/<str:pk>/", views.ProductCategoryDetailView.as_view(), name="inventory_ProductCategory_detail"),
    path("inventory/ProductCategory/update/<str:pk>/", views.ProductCategoryUpdateView.as_view(), name="inventory_ProductCategory_update"),
)