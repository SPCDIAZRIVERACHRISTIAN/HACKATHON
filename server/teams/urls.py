from django.urls import path
from .views import teams_collection, team_detail

urlpatterns = [
    path("/teams/", teams_collection, name="teams-collection"),
    path("teams/<int:team_id>/", team_detail, name="team-detail"),
]
