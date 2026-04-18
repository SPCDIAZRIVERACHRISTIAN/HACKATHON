import json
import secrets
import string

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import Users
from teams.models import Team


def generate_password(length=12):
    alphabet = string.ascii_letters + string.digits + "!@#$%&*"
    while True:
        pwd = "".join(secrets.choice(alphabet) for _ in range(length))
        has_upper = any(c.isupper() for c in pwd)
        has_lower = any(c.islower() for c in pwd)
        has_digit = any(c.isdigit() for c in pwd)
        has_special = any(c in "!@#$%&*" for c in pwd)
        if has_upper and has_lower and has_digit and has_special:
            return pwd


def list_users(request):
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    users = Users.objects.select_related("team").all()
    data = [
        {
            "id": u.id,
            "username": u.username,
            "full_name": u.full_name,
            "role": u.role,
            "team_id": u.team_id,
            "team_name": u.team.name if u.team else None,
            "is_active": u.is_active,
            "must_change_password": u.must_change_password,
        }
        for u in users
    ]
    return JsonResponse(data, safe=False, status=200)


@csrf_exempt
@require_POST
def create_user(request):
    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        auto_generate = data.get("auto_generate_password", False)
        role = data.get("role")
        team_id = data.get("team_id")
        full_name = data.get("full_name")

        if not username or not role:
            return JsonResponse(
                {"error": "username and role are required"},
                status=400,
            )

        if auto_generate:
            password = generate_password()
        elif not password:
            return JsonResponse(
                {"error": "password is required (or enable auto-generate)"},
                status=400,
            )

        if Users.objects.filter(username=username).exists():
            return JsonResponse(
                {"error": "A user with that username already exists."},
                status=409,
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
        user.must_change_password = True
        user.save()

        response_data = {
            "message": "User created successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role,
                "team_id": user.team_id,
                "full_name": user.full_name,
            },
        }
        if auto_generate:
            response_data["generated_password"] = password

        return JsonResponse(response_data, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)


@csrf_exempt
def delete_user(request, user_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        user = Users.objects.get(id=user_id)
    except Users.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    if user.is_superuser:
        return JsonResponse({"error": "Cannot delete a superuser"}, status=403)

    user.delete()
    return JsonResponse({"message": "User deleted successfully"}, status=200)


@csrf_exempt
@require_POST
def reset_password(request, user_id):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        data = {}

    try:
        user = Users.objects.get(id=user_id)
    except Users.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    auto_generate = data.get("auto_generate", False)
    new_password = data.get("new_password")

    if auto_generate:
        new_password = generate_password()
    elif not new_password:
        return JsonResponse(
            {"error": "new_password is required (or enable auto_generate)"},
            status=400,
        )

    user.set_password(new_password)
    user.must_change_password = True
    user.save()

    response_data = {"message": f"Password reset for {user.username}"}
    if auto_generate:
        response_data["generated_password"] = new_password

    return JsonResponse(response_data, status=200)


@csrf_exempt
@require_POST
def change_password(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    new_password = data.get("new_password")
    if not new_password or len(new_password) < 8:
        return JsonResponse(
            {"error": "Password must be at least 8 characters"},
            status=400,
        )

    request.user.set_password(new_password)
    request.user.must_change_password = False
    request.user.save()

    login(request, request.user)

    return JsonResponse({"message": "Password changed successfully"}, status=200)


@csrf_exempt
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
                    "must_change_password": user.must_change_password,
                },
            },
            status=200,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)


@csrf_exempt
@require_POST
def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"}, status=200)
