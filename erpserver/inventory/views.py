from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views import generic
from django_filters.views import FilterView
from django_tables2 import SingleTableView, LazyPaginator, SingleTableMixin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from . import models
from . import forms
from .service import InventoryService
from .tables import ProductTable


@login_required
def inventory_dashboard(request):
    return HttpResponse(render(request, 'inventory/inventory_dashboard.html'))


@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def get_product_code(request):
    category = request.data['category_code']
    sub_category = request.data['sub_category_code']
    brand = request.data['brand']
    inventory_service = InventoryService()
    code = inventory_service.generate_product_code(category, sub_category, brand)
    return JsonResponse(code, safe=False)


class ProductPriceMasterListView(generic.ListView):
    model = models.ProductPriceMaster
    form_class = forms.ProductPriceMasterForm


class ProductPriceMasterCreateView(generic.CreateView):
    model = models.ProductPriceMaster
    form_class = forms.ProductPriceMasterForm


class ProductPriceMasterDetailView(generic.DetailView):
    model = models.ProductPriceMaster
    form_class = forms.ProductPriceMasterForm


class ProductPriceMasterUpdateView(generic.UpdateView):
    model = models.ProductPriceMaster
    form_class = forms.ProductPriceMasterForm
    pk_url_kwarg = "pk"


class ProductBrandMasterListView(generic.ListView):
    model = models.ProductBrandMaster
    form_class = forms.ProductBrandMasterForm


class ProductBrandMasterCreateView(generic.CreateView):
    model = models.ProductBrandMaster
    form_class = forms.ProductBrandMasterForm


class ProductBrandMasterDetailView(generic.DetailView):
    model = models.ProductBrandMaster
    form_class = forms.ProductBrandMasterForm


class ProductBrandMasterUpdateView(generic.UpdateView):
    model = models.ProductBrandMaster
    form_class = forms.ProductBrandMasterForm
    pk_url_kwarg = "pk"


class UnitMasterListView(generic.ListView):
    model = models.UnitMaster
    form_class = forms.UnitMasterForm


class UnitMasterCreateView(generic.CreateView):
    model = models.UnitMaster
    form_class = forms.UnitMasterForm


class UnitMasterDetailView(generic.DetailView):
    model = models.UnitMaster
    form_class = forms.UnitMasterForm


class UnitMasterUpdateView(generic.UpdateView):
    model = models.UnitMaster
    form_class = forms.UnitMasterForm
    pk_url_kwarg = "pk"


class ProductSubCategoryListView(generic.ListView):
    model = models.ProductSubCategory
    form_class = forms.ProductSubCategoryForm


class ProductSubCategoryCreateView(generic.CreateView):
    model = models.ProductSubCategory
    form_class = forms.ProductSubCategoryForm


class ProductSubCategoryDetailView(generic.DetailView):
    model = models.ProductSubCategory
    form_class = forms.ProductSubCategoryForm


class ProductSubCategoryUpdateView(generic.UpdateView):
    model = models.ProductSubCategory
    form_class = forms.ProductSubCategoryForm
    pk_url_kwarg = "pk"


class ProductMasterListView(SingleTableView):
    model = models.ProductMaster
    # form_class = forms.ProductMasterForm
    table_class = ProductTable
    table_data = models.ProductMaster.objects.all()
    paginator_class = LazyPaginator


class ProductMasterCreateView(generic.CreateView):
    model = models.ProductMaster
    form_class = forms.ProductMasterForm


class ProductMasterDetailView(generic.DetailView):
    model = models.ProductMaster
    form_class = forms.ProductMasterForm


class ProductMasterUpdateView(generic.UpdateView):
    model = models.ProductMaster
    form_class = forms.ProductMasterForm
    pk_url_kwarg = "pk"


class ProductCategoryListView(generic.ListView):
    model = models.ProductCategory
    form_class = forms.ProductCategoryForm


class ProductCategoryCreateView(generic.CreateView):
    model = models.ProductCategory
    form_class = forms.ProductCategoryForm


class ProductCategoryDetailView(generic.DetailView):
    model = models.ProductCategory
    form_class = forms.ProductCategoryForm


class ProductCategoryUpdateView(generic.UpdateView):
    model = models.ProductCategory
    form_class = forms.ProductCategoryForm
    pk_url_kwarg = "pk"
