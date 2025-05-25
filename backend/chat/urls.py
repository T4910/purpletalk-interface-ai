from django.urls import path
from .views import ConversationListView, MessageListView, AIChatMessageView, CreateConversationWithMessageView

urlpatterns = [
    # 
    path('conversations/message/', AIChatMessageView.as_view(), name='chat-ai'),
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<str:session_id>/messages/', MessageListView.as_view(), name='message-list'),
    # path('conversations/new/', CreateConversationView.as_view(), name='create-conversation'),
    path('conversations/new_with_message/', CreateConversationWithMessageView.as_view(), name='create-conversation-with-message'),
]
