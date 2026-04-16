import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST

from .models import User
from teams.models import Team


@require_POST
def create_user(request):
    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        role = data.get("role")
        team_id = data.get("team_id")

        if not username or not password or not role:
            return JsonResponse(
                {"error": "username, password, and role are required"},
                status=400,
            )

        team = None
        if role == "student":
            if not team_id:
                return JsonResponse(
                    {"error": "team_id is required for students"},
                    status=400,
                )
            try:
                team = Team.objects.get(id=team_id)
            except Team.DoesNotExist:
                return JsonResponse({"error": "Invalid team_id"}, status=400)

        if role == "judge":
            team = None

        user = User.objects.create_user(
            username=username,
            password=password,
            role=role,
            team=team,
        )

        return JsonResponse(
            {
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "team_id": user.team_id,
                },
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)
