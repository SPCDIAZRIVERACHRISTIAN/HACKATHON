from django_bridge.response import Response


def home(request):
    return Response(request, "Home", {})


def dashboard(request):
    return Response(request, "Dashboard", {})


def judge(request):
    return Response(request, "Judge", {})


def student(request):
    return Response(request, "Student", {})


def admin_panel(request):
    return Response(request, "Admin", {})