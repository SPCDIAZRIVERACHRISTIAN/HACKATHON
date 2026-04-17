from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Users


@admin.register(Users)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Hackathon Info", {"fields": ("role", "team")}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Hackathon Info", {"fields": ("role", "team")}),
    )

    list_display = ("username", "role", "team", "is_staff")
    list_filter = ("role", "is_staff", "is_superuser", "is_active")
