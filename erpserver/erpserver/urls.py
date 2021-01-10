"""erpserver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from erpserver import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url('accounts/', include('django.contrib.auth.urls')),
    url('logout/', views.user_logout, name='user_logout'),
    path('admin/', admin.site.urls),
    url('authentication/', include('security.urls')),
    url('manage_store/', include('store.urls')),
    url('manage_inventory/', include('inventory.urls')),
    url('manage_vendor/', include('vendor.urls')),
    url('ecom/', include('ecommerce.urls')),
    url('manage_sales/', include('sales.urls')),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
