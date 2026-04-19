from django.urls import path
from .views import teams_collection, team_detail, events_collection, event_detail, submit_score

urlpatterns = [
    path("teams/", teams_collection, name="teams-collection"),
    path("teams/<int:team_id>/", team_detail, name="team-detail"),
    path("teams/<int:team_id>/submit-score/", submit_score, name="submit-score"),
    path("events/", events_collection, name="events-collection"),
    path("events/<int:event_id>/", event_detail, name="event-detail"),
]
