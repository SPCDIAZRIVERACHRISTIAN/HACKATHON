import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from .models import Users
from teams.models import Team


@require_POST
def create_user(request):
    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        role = data.get("role")
        team_id = data.get("team_id")
        full_name = data.get("full_name")

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

        user = Users.objects.create_user(
            username=username,
            password=password,
            role=role,
            team=team,
            full_name=full_name,
        )

        return JsonResponse(
            {
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "team_id": user.team_id,
                    "full_name": user.full_name,
                },
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)


@require_POST
def login_user(request):
    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "username and password are required"},
                status=400,
            )

        user = authenticate(request, username=username, password=password)

        if user is None:
            return JsonResponse(
                {"error": "Invalid username or password"},
                status=401,
            )

        login(request, user)

        return JsonResponse(
            {
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "team_id": user.team_id,
                    "full_name": user.full_name,
                },
            },
            status=200,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)


@require_POST
def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logout successful"}, status=200)
