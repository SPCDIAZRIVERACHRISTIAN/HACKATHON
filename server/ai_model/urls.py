from django.urls import path
from .views import chat_completions

urlpatterns = [
    path("v2/chat", chat_completions, name="chat_completions"),
]