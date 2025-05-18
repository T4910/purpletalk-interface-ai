from django.urls import path
from .views import agent_chat

urlpatterns = [
    path('chat/', agent_chat),
]