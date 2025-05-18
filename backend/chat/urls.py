from django.urls import path
from .views import ConversationListView, MessageListView, AIChatView

urlpatterns = [
    # 
    path('conversations/message/', AIChatView.as_view(), name='chat-ai'),
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<str:session_id>/messages/', MessageListView.as_view(), name='message-list'),
]
