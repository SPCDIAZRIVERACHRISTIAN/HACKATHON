from functools import wraps

from django.shortcuts import redirect
from django_bridge.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie


def login_redirect_for_role(user):
    if user.role == "admin":
        return redirect("/dashboard/")
    if user.role == "judge":
        return redirect("/dashboard/")
    if user.role == "student":
        return redirect("/dashboard/")
    return redirect("/login/")


def authenticated_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("/login/")
        return view_func(request, *args, **kwargs)

    return wrapped_view


def role_required(*allowed_roles, allow_admin=False):
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect("/login/")

            if allow_admin and request.user.role == "admin":
                return view_func(request, *args, **kwargs)

            if request.user.role not in allowed_roles:
                return login_redirect_for_role(request.user)

            return view_func(request, *args, **kwargs)

        return wrapped_view

    return decorator


def home(request):
    return Response(request, "Home", {})


@authenticated_required
def dashboard(request):
    return Response(request, "Dashboard", {})


@role_required("judge", allow_admin=True)
def judge(request):
    return Response(request, "Judge", {})


@role_required("student", allow_admin=True)
def student(request):
    return Response(request, "Student", {})


@role_required("admin")
def admin_panel(request):
    return Response(request, "Admin", {})


@ensure_csrf_cookie
def login_view(request):
    if request.user.is_authenticated:
        return login_redirect_for_role(request.user)

    return Response(request, "Login", {})


@ensure_csrf_cookie
def create_account(request):
    if request.user.is_authenticated:
        return login_redirect_for_role(request.user)

    return Response(request, "CreateAccount", {})
