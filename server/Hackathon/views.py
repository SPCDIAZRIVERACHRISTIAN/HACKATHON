from django_bridge.response import Response
from functools import wraps

from django.shortcuts import redirect
from django_bridge.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie


def role_required(*allowed_roles):
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect("/login/")

            if request.user.role not in allowed_roles:
                # Send authenticated users to the correct place for their role
                if request.user.role == "admin":
                    return redirect("/dashboard/")
                if request.user.role == "judge":
                    return redirect("/judge/")
                if request.user.role == "student":
                    return redirect("/student/")

                return redirect("/login/")

            return view_func(request, *args, **kwargs)

        return wrapped_view

    return decorator


def home(request):
    return Response(request, "Home", {})


@role_required("admin")
def dashboard(request):
    return Response(request, "Dashboard", {})


@role_required("judge")
def judge(request):
    return Response(request, "Judge", {})


@role_required("student")
def student(request):
    return Response(request, "Student", {})


@role_required("admin")
def admin_panel(request):
    return Response(request, "Admin", {})


@ensure_csrf_cookie
def login_view(request):
    if request.user.is_authenticated:
        if request.user.role == "admin":
            return redirect("/dashboard/")
        if request.user.role == "judge":
            return redirect("/judge/")
        if request.user.role == "student":
            return redirect("/student/")

    return Response(request, "Login", {})


@ensure_csrf_cookie
def create_account(request):
    if request.user.is_authenticated:
        if request.user.role == "admin":
            return redirect("/dashboard/")
        if request.user.role == "judge":
            return redirect("/judge/")
        if request.user.role == "student":
            return redirect("/student/")

    return Response(request, "CreateAccount", {})
