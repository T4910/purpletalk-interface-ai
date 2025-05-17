import re
from rest_framework import serializers

def validate_session_id_no_symbols(value):
    if not re.match(r'^[a-zA-Z0-9]+$', value):
        raise serializers.ValidationError("Session ID must be alphanumeric and contain no symbols.")
    return value

class AgentAPISerializer(serializers.Serializer):
    session_id = serializers.CharField(
        required=False,
        validators=[validate_session_id_no_symbols]
    )
    user_input = serializers.CharField(required=True)
