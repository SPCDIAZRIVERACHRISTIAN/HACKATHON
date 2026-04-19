import json
from decimal import Decimal, InvalidOperation

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Team, HackathonEvent, Score


def serialize_team(team):
    judgings = []
    for s in team.judgings.all():
        judgings.append({
            "judge_name": s.judge.full_name or s.judge.username,
            "technical": s.technical,
            "creativity": s.creativity,
            "impact": s.impact,
            "presentation": s.presentation,
            "ux": s.ux,
            "weighted_score": str(s.weighted_score * 20), # percentage
            "notes": s.notes,
        })

    return {
        "id": team.id,
        "name": team.name,
        "project_name": team.project_name,
        "mentor_name": team.mentor_name,
        "score": str(team.score),
        "judges_count": len(judgings),
        "judgings": judgings,
        "created_at": team.created_at.isoformat(),
        "updated_at": team.updated_at.isoformat(),
    }


def serialize_event(event):
    return {
        "id": event.id,
        "label": event.label,
        "start_time": event.start_time.isoformat(),
        "end_time": event.end_time.isoformat() if event.end_time else None,
        "order": event.order,
    }


@csrf_exempt
def submit_score(request, team_id):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed."}, status=405)

    team = get_object_or_404(Team, id=team_id)

    # In a real app we'd check if user is judge
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    # Validate range 1-5
    def validate_range(val):
        try:
            v = int(val)
            return max(1, min(5, v))
        except (ValueError, TypeError):
            return 1

    score, created = Score.objects.update_or_create(
        team=team,
        judge=request.user,
        defaults={
            "technical": validate_range(payload.get("technical")),
            "creativity": validate_range(payload.get("creativity")),
            "impact": validate_range(payload.get("impact")),
            "presentation": validate_range(payload.get("presentation")),
            "ux": validate_range(payload.get("ux")),
            "notes": payload.get("notes", ""),
        }
    )

    return JsonResponse({
        "message": "Score submitted successfully.",
        "weighted_score": str(score.weighted_score),
        "team_average": str(team.score),
        "judges_count": team.judgings.count()
    }, status=200)


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
        mentor_name = (payload.get("mentor_name") or "").strip()
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
            mentor_name=mentor_name,
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

        if "mentor_name" in payload:
            team.mentor_name = (payload.get("mentor_name") or "").strip()

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


@csrf_exempt
def events_collection(request):
    if request.method == "GET":
        events = HackathonEvent.objects.all()
        return JsonResponse([serialize_event(e) for e in events], safe=False)

    if request.method == "POST":
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        label = (payload.get("label") or "").strip()
        start_time = payload.get("start_time")
        end_time = payload.get("end_time")
        order = payload.get("order", 0)

        if not label or not start_time:
            return JsonResponse({"error": "Label and start_time are required."}, status=400)

        event = HackathonEvent.objects.create(
            label=label,
            start_time=start_time,
            end_time=end_time or None,
            order=order,
        )
        return JsonResponse(serialize_event(event), status=201)

    return JsonResponse({"error": "Method not allowed."}, status=405)


@csrf_exempt
def event_detail(request, event_id):
    event = get_object_or_404(HackathonEvent, id=event_id)

    if request.method == "GET":
        return JsonResponse(serialize_event(event))

    if request.method in ["PUT", "PATCH"]:
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        if "label" in payload:
            event.label = (payload["label"] or "").strip()
        if "start_time" in payload:
            event.start_time = payload["start_time"]
        if "end_time" in payload:
            event.end_time = payload["end_time"] or None
        if "order" in payload:
            event.order = payload["order"]

        event.save()
        return JsonResponse(serialize_event(event))

    if request.method == "DELETE":
        event.delete()
        return JsonResponse({"message": "Event deleted."})

    return JsonResponse({"error": "Method not allowed."}, status=405)
