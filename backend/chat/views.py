from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from ai_agent.agent_flow.chat_controller import handle_message
from ai_agent.serializers import AgentAPISerializer
from django.db.models import OuterRef, Subquery, Count
import asyncio
import traceback
from asgiref.sync import async_to_sync
from django.http import StreamingHttpResponse

class ConversationListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ConversationSerializer

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by('-updated_at')

    # def get_queryset(self):
    #     latest_message_subquery = Message.objects.filter(
    #         conversation=OuterRef('pk')
    #     ).order_by('-timestamp').values('timestamp')[:1]

    #     return Conversation.objects.filter(user=self.request.user).annotate(
    #         latest_message_time=Subquery(latest_message_subquery)
    #     ).order_by('-latest_message_time')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MessageListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MessageSerializer

    def get_queryset(self):
        session_id = self.kwargs['session_id']
        return Message.objects.filter(conversation__user=self.request.user, conversation__session_id=session_id).order_by('timestamp')

class AIChatMessageView(APIView):
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
                conversation = Conversation.objects.annotate(message_count=Count('messages')).get(session_id=session_id, user=user)
            except Conversation.DoesNotExist:
                return Response({'error': 'Conversation not found or does not belong to user.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'session_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Get AI response (sync, not streaming)
        try:
            session_id, ai_reply = handle_message(session_id, user_input)
        except Exception as e:
            return Response({'error': 'AI did not respond'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            traceback.print_exc(e)

        # 2. Save user message
        # if conversation. > 1:
        if conversation.message_count != 1:
            Message.objects.create(conversation=conversation, sender='user', content=user_input)

        # 4. Save AI message
        ai_message = Message.objects.create(conversation=conversation, sender='assistant', content=ai_reply)

        # Update conversation timestamp
        conversation.save()
        
        return Response({
            "message_id": ai_message.id,
            "agent_reply": ai_reply,
            "session_id": conversation.session_id,
            "sender": ai_message.sender,
            "message_timestamp": ai_message.timestamp,
        }, status=status.HTTP_200_OK)

class CreateConversationWithMessageView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ConversationSerializer

    def create(self, request):
        user_input = request.data.get('user_input')
        if not user_input:
            return Response({'error': 'user_input is required.'}, status=status.HTTP_400_BAD_REQUEST)
        # Create conversation
        conversation = Conversation.objects.create(user=request.user)
        # Save first message
        Message.objects.create(conversation=conversation, sender='user', content=user_input)
        return Response({
            "session_id": conversation.session_id,
            "created_at": conversation.created_at,
        }, status=status.HTTP_201_CREATED)
