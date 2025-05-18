from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from ai_agent.agent_flow.chat_controller import handle_message
from ai_agent.serializers import AgentAPISerializer
import asyncio


class ConversationListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ConversationSerializer

    def get_queryset(self):
        # Return conversations for the authenticated user
        return Conversation.objects.filter(user=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        # Create a new conversation linked to the authenticated user
        serializer.save(user=self.request.user)

class MessageListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MessageSerializer

    def get_queryset(self):
        # Return messages for a specific conversation belonging to the authenticated user
        session_id = self.kwargs['session_id']
        return Message.objects.filter(conversation__user=self.request.user, conversation__session_id=session_id).order_by('timestamp')

class AIChatView(APIView):
    """
    Handles sending a message to the AI agent and saving the conversation.
    """
    permission_classes = (IsAuthenticated,)

# Refactor later
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
            # Create a new conversation if no session_id is provided
            conversation = Conversation.objects.create(user=user)
            session_id = conversation.session_id

        # 2. Save the user's message to the database
        Message.objects.create(
            conversation=conversation,
            sender='user',
            content=user_input
        )

        # 3. Send message to the AI agent
        try:
            try:
                session_id, agent_reply_content = asyncio.run(handle_message(session_id, user_input))
            except RuntimeError:
                # Handle nested event loop case (e.g., if using in a thread or notebook)
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                session_id, agent_reply_content = loop.run_until_complete(handle_message(session_id, user_input))

        except Exception as e:
            # Log the error in a real application
            print(f"Error calling AI agent: {e}")
            agent_reply_content = "An error occurred while processing your request."
            # You might want to return a server error status in a real app depending on how you want to handle AI errors
            return Response({'error': 'An error occurred with the AI agent.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 4. Save the AI's response to the database
        message = Message.objects.create(
            conversation=conversation,
            sender='assistant',
            content=agent_reply_content
        )

        # 5. Return the AI's response (non-streamed)
        return Response({'session_id': session_id, 'agent_reply': agent_reply_content, 'message_id': message.id, 'message_timestamp': message.timestamp.isoformat(), 'sender': 'assistant'}, status=status.HTTP_200_OK)

