from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.decorators.cache import cache_control
from django.shortcuts import render, redirect


@cache_control(no_cache=True)
@login_required
def index(request):
    # load application settings
    if 'store_id' not in request.session:
        return HttpResponseRedirect(reverse_lazy('store_select'))
    if request.session['store_id'] is None:
        return HttpResponseRedirect(reverse_lazy('store_select'))
    return HttpResponse(render(request, 'index.html'))


def user_logout(request):
    logout(request)
    return HttpResponse(render(request, 'registration/logout.html'))