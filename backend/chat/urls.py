from django.urls import path
from .views import ConversationListView, MessageListView, AIChatStreamView

urlpatterns = [
    # 
    path('conversations/message/', AIChatStreamView.as_view(), name='chat-ai'),
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<str:session_id>/messages/', MessageListView.as_view(), name='message-list'),
]
