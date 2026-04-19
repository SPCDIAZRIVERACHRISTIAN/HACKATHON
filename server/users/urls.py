from django.urls import path
from .views import (
    create_user,
    login_user,
    logout_user,
    list_users,
    delete_user,
    reset_password,
    change_password,
)

urlpatterns = [
    path("", list_users),
    path("create/", create_user),
    path("login/", login_user),
    path("logout/", logout_user),
    path("change-password/", change_password),
    path("<int:user_id>/", delete_user),
    path("<int:user_id>/reset-password/", reset_password),
]
