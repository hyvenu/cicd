from django import forms
from django.contrib import admin

from django.contrib.auth.admin import UserAdmin

# Register your models here.
from security.models import User

class UserCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email',)

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances
    add_form = UserCreationForm
    list_display = ("email", 'first_name', 'last_name' ,'is_superuser', 'is_staff', 'is_active')
    ordering = ("email",)

    fieldsets = (
        (None, {'fields': ('email', 'password', 'first_name', 'last_name')}),

        )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name', 'is_superuser', 'is_staff', 'is_active','groups')}
            ),

        )

    filter_horizontal = ()

admin.site.register(User, CustomUserAdmin)