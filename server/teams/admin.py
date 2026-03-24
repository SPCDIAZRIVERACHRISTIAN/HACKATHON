from django.contrib import admin
from .models import Team

# Register your models here.
@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "project_name", "score", "created_at")
    search_fields = ("name", "project_name")
    ordering = ("name",)
