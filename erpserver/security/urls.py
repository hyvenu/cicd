

from django.conf import settings
from django.conf.urls import url
from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from security.views import CreateUserAPIView, CustomTokenObtainPairView, CustomerAddressViewSet, change_password, \
    get_user_permissions, change_phone_number
from django.contrib.auth import views as auth_views

router = routers.DefaultRouter()
router.register(r'address', CustomerAddressViewSet)

urlpatterns = [
    url(r'api/customer/', include(router.urls)),
    url(r'api/user/', CreateUserAPIView.as_view()),
    path(r'api-auth', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/change_password', change_password, name="change_password"),
    path('api/get_permissions', get_user_permissions, name="get_user_permissions"),
    path('api/change_phone_number', change_phone_number, name="change_phone_number"),
]