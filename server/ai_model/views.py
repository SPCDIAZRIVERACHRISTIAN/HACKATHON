import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .ai_wrapper import process_model_request


@csrf_exempt
def chat_completions(request):
    if request.method != "POST":
        return JsonResponse(
            {"status": "invalid", "message": "method not allowed"},
            status=405,
        )

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"status": "invalid", "message": "invalid json body"},
            status=400,
        )

    context = body.get("context")
    app_access_key = request.headers.get("APP-ACCESS-KEY")
    app_secret_key = request.headers.get("APP-SECRET-KEY")

    result = process_model_request(
        context=context,
        app_access_key=app_access_key,
        app_secret_key=app_secret_key,
    )

    return JsonResponse(result["data"], status=result["status_code"])
