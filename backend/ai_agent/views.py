from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

@api_view(["GET"])
@permission_classes([AllowAny])
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
            {
                "status": "unhealthy",
                "message": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )
