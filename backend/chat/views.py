from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from ai_agent.agent_flow.chat_controller import handle_message
from ai_agent.serializers import AgentAPISerializer
import asyncio
from django.http import StreamingHttpResponse

class ConversationListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ConversationSerializer

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MessageListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MessageSerializer

    def get_queryset(self):
        session_id = self.kwargs['session_id']
        return Message.objects.filter(conversation__user=self.request.user, conversation__session_id=session_id).order_by('timestamp')

class AIChatStreamView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = AgentAPISerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        session_id = serializer.validated_data.get("session_id")
        user_input = serializer.validated_data.get("user_input")

        if not user_input:
            return Response({'error': 'user_input is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Find or create the conversation
        if session_id:
            try:
                conversation = Conversation.objects.get(session_id=session_id, user=user)
            except Conversation.DoesNotExist:
                return Response({'error': 'Conversation not found or does not belong to user.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            conversation = Conversation.objects.create(user=user)
            session_id = conversation.session_id

        # 2. Save user message
        Message.objects.create(conversation=conversation, sender='user', content=user_input)

        # 3. Streaming response from AI
        async def event_stream():
            try:
                async for chunk in handle_message(session_id, user_input):
                    yield f"data: {chunk}\n\n"
            except Exception as e:
                yield f"event: error\ndata: {str(e)}\n\n"

        return StreamingHttpResponse(event_stream(), content_type='text/event-stream')
