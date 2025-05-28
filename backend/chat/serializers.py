from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'timestamp']
        read_only_fields = ['id', 'conversation', 'timestamp'] # Conversation and timestamp are set by backend

class ConversationSerializer(serializers.ModelSerializer):
    # Include messages nested within the conversation
    queryset = Message.objects.all()[:2]
    messages = MessageSerializer(queryset, many=True, read_only=True, )

    class Meta:
        model = Conversation
        fields = ['id', 'user', 'created_at', 'updated_at', 'messages', 'session_id']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'messages', 'session_id'] # User and timestamps set by backend, messages are read-only via this serializer (created via message endpoint)
