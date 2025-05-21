# views.py
import asyncio
import traceback

from asgiref.sync import async_to_sync
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .serializers import AgentAPISerializer
from .agent_flow.chat_controller import handle_message, handle_message_stream

from rest_framework.permissions import AllowAny

@api_view(["GET"])
@permission_classes([AllowAny])
def hello_world(request):
    return Response({"message": "Hello, World!"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def agent_chat(request):
    """
    Non-streaming chat: runs the full LLM call and returns the complete reply.
    """
    serializer = AgentAPISerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    session_id = serializer.validated_data.get("session_id")
    user_input = serializer.validated_data["user_input"]

    try:
        # asyncio.run can clobber existing loops in Django, so we
        # fall back to creating a fresh loop if needed.
        sid, reply = asyncio.run(handle_message(session_id, user_input))
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        sid, reply = loop.run_until_complete(handle_message(session_id, user_input))
    except Exception as e:
        traceback.print_exc()
def health_check(request):
    try:
        return Response(
            {
                "status": "healthy",
                "message": "Service is running"
            },
            status=status.HTTP_200_OK,
            content_type='application/json'
        )
    except Exception as e:
        return Response(
            {"detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(
        {"session_id": sid, "agent_reply": reply},
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def agent_chat_stream(request):
    """
    Streaming chat via Server-Sent Events. Yields only text after the
    'Final Answer:' marker.
    """
    serializer = AgentAPISerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    session_id = serializer.validated_data.get("session_id")
    user_input = serializer.validated_data["user_input"]

    # Turn our async generator into a sync one
    stream_gen = async_to_sync(handle_message_stream)(session_id, user_input)

    def event_stream():
        try:
            for chunk in stream_gen:
                # SSE framing
                yield f"data: {chunk}\n\n"
                
        except Exception as e:
            traceback.print_exc()
            # send an error event
            yield f"event: error\ndata: {str(e)}\n\n"

    return StreamingHttpResponse(
        event_stream(),
        content_type="text/event-stream"
    )
            {
                "status": "unhealthy",
                "message": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )
