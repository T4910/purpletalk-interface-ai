from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import AgentAPISerializer
from .agent_flow.chat_controller import handle_message  # FIXED import
import asyncio

@api_view(["GET"])
@permission_classes([AllowAny])
def hello_world(request):
    return Response({"message": "Hello, World!"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def agent_chat(request, *args, **kwargs):
    serializer = AgentAPISerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        session_id = validated_data.get("session_id")
        user_input = validated_data.get("user_input")

        # Call the async handle_message function
        try:
            session_id, agent_reply = asyncio.run(handle_message(session_id, user_input))
        except RuntimeError:
            # Handle nested event loop case (e.g., if using in a thread or notebook)
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            session_id, agent_reply = loop.run_until_complete(handle_message(session_id, user_input))

        return Response(
            {"session_id": session_id, "agent_reply": agent_reply},
            status=status.HTTP_200_OK
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
