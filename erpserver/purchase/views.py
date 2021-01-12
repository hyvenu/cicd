from django.shortcuts import render
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


# Create your views here.
class PurchaseRequisitionView(generic.CreateView):
    model = models.PurchaseRequisition
