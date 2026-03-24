from django.shortcuts import render

# Create your views here.

import json
from decimal import Decimal, InvalidOperation

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from .models import Team


def serialize_team(team):
    return {
        "id": team.id,
        "name": team.name,
        "project_name": team.project_name,
        "score": str(team.score),
        "created_at": team.created_at.isoformat(),
        "updated_at": team.updated_at.isoformat(),
    }


@csrf_exempt
def teams_collection(request):
    if request.method == "GET":
        teams = Team.objects.all()
        data = [serialize_team(team) for team in teams]
        return JsonResponse(data, safe=False, status=200)

    if request.method == "POST":
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        name = (payload.get("name") or "").strip()
        project_name = (payload.get("project_name") or "").strip()
        raw_score = payload.get("score", 0)

        if not name:
            return JsonResponse({"error": "Team name is required."}, status=400)

        try:
            score = Decimal(str(raw_score))
        except (InvalidOperation, ValueError):
            return JsonResponse({"error": "Score must be a valid number."}, status=400)

        if Team.objects.filter(name=name).exists():
            return JsonResponse({"error": "A team with that name already exists."}, status=409)

        team = Team.objects.create(
            name=name,
            project_name=project_name,
            score=score,
        )

        return JsonResponse(serialize_team(team), status=201)

    return JsonResponse({"error": "Method not allowed."}, status=405)


@csrf_exempt
def team_detail(request, team_id):
    team = get_object_or_404(Team, id=team_id)

    if request.method == "GET":
        return JsonResponse(serialize_team(team), status=200)

    if request.method in ["PUT", "PATCH"]:
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        if "name" in payload:
            name = (payload.get("name") or "").strip()
            if not name:
                return JsonResponse({"error": "Team name cannot be empty."}, status=400)

            if Team.objects.exclude(id=team.id).filter(name=name).exists():
                return JsonResponse({"error": "A team with that name already exists."}, status=409)

            team.name = name

        if "project_name" in payload:
            team.project_name = (payload.get("project_name") or "").strip()

        if "score" in payload:
            try:
                team.score = Decimal(str(payload.get("score")))
            except (InvalidOperation, ValueError):
                return JsonResponse({"error": "Score must be a valid number."}, status=400)

        team.save()
        return JsonResponse(serialize_team(team), status=200)

    if request.method == "DELETE":
        team.delete()
        return JsonResponse({"message": "Team deleted successfully."}, status=200)

    return JsonResponse({"error": "Method not allowed."}, status=405)
