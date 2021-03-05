from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.http import HttpResponseRedirect, JsonResponse
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

from .models import StoreUser
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
    return  JsonResponse(site_settings,safe=False,status=status.HTTP_200_OK)


