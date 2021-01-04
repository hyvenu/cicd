from django.contrib import admin

# Register your models here.
from security.models import User

admin.site.register(User)