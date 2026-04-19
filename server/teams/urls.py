from django.urls import path
from .views import (
    teams_collection,
    team_detail,
    events_collection,
    event_detail,
    submit_score,
    team_tasks,
    toggle_task,
)

urlpatterns = [
    path("teams/", teams_collection, name="teams-collection"),
    path("teams/<int:team_id>/", team_detail, name="team-detail"),
    path("teams/<int:team_id>/submit-score/", submit_score, name="submit-score"),
    path("teams/<int:team_id>/tasks/", team_tasks, name="team-tasks"),
    path("tasks/<int:task_id>/toggle/", toggle_task, name="toggle-task"),
    path("events/", events_collection, name="events-collection"),
    path("events/<int:event_id>/", event_detail, name="event-detail"),
]
