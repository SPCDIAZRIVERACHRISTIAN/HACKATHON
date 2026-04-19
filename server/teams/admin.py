from django.contrib import admin
from .models import Team, Score, HackathonEvent

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "project_name", "score", "get_judges_count", "created_at")
    search_fields = ("name", "project_name")
    ordering = ("-score", "name")

    def get_judges_count(self, obj):
        return obj.judgings.count()
    get_judges_count.short_description = "Judges"

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ("team", "judge", "weighted_score", "technical", "creativity", "impact", "presentation", "ux", "created_at")
    list_filter = ("team", "judge")
    raw_id_fields = ("team", "judge")

@admin.register(HackathonEvent)
class HackathonEventAdmin(admin.ModelAdmin):
    list_display = ("label", "start_time", "end_time", "order")
    ordering = ("order", "start_time")
