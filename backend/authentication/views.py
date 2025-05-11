from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate
from django.conf import settings
from django.middleware import common

from .serializers import (
    SignupSerializer,
    LoginSerializer,
    RequestPasswordResetSerializer,
    ResetPasswordSerializer,
    TwoFactorSetupSerializer,
    TwoFactorVerifySerializer,
    TwoFactorToggleSerializer,
)
from .models import CustomUser
import pyotp

# Helper function to set JWT cookies
def set_jwt_cookies(response, access_token, refresh_token):
    max_age = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
    response.set_cookie(
        settings.SIMPLE_JWT['JWT_AUTH_COOKIE'],
        str(access_token),
        max_age=int(max_age),
        httponly=settings.SIMPLE_JWT['JWT_AUTH_HTTPONLY'],
        secure=settings.SIMPLE_JWT['JWT_AUTH_SECURE'],
        samesite=settings.SIMPLE_JWT['JWT_AUTH_SAMESITE']
    )
    refresh_max_age = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
    response.set_cookie(
        settings.SIMPLE_JWT['JWT_AUTH_REFRESH_COOKIE'],
        str(refresh_token),
        max_age=int(refresh_max_age),
        httponly=settings.SIMPLE_JWT['JWT_AUTH_HTTPONLY'],
        secure=settings.SIMPLE_JWT['JWT_AUTH_SECURE'],
        samesite=settings.SIMPLE_JWT['JWT_AUTH_SAMESITE']
    )
    return response

class SignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer

class LoginView(TokenObtainPairView):
    # Use the default TokenObtainPairView for generating tokens
    # We will override post to set cookies
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']

        if user.is_2fa_enabled:
             # If 2FA is enabled, return a response indicating that 2FA is required
            response = Response({'detail': '2FA required.', 'user_id': user.id}, status=status.HTTP_200_OK)
            # You might want to set a temporary cookie or session variable here
            # to indicate that the user has passed the first stage of login
            return response
        
        # If 2FA is not enabled or not required, proceed with token generation and cookie setting
        refresh = RefreshToken.for_user(user)
        response = Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)

        set_jwt_cookies(response, refresh.access_token, refresh)

        return response

class TwoFactorVerifyView(APIView):
    permission_classes = (AllowAny,) # Allow verification without full authentication initially

    def post(self, request, *args, **kwargs):
        # In a real application, you would retrieve the user based on a temporary cookie or session
        # set during the first stage of login (in LoginView). For this example, we'll assume user_id is sent in the request.
        user_id = request.data.get('user_id') # Assuming user_id is sent after initial login
        code = request.data.get('code')

        if not user_id or not code:
             return Response({"detail": "User ID and code are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Invalid user ID."}, status=status.HTTP_404_NOT_FOUND)

        if not user.is_2fa_enabled or not user.twofa_secret:
            return Response({"detail": "2FA is not enabled for this user."}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.totp.TOTP(user.twofa_secret)
        if not totp.verify(code):
            return Response({"detail": "Invalid 2FA code."}, status=status.HTTP_400_BAD_REQUEST)

        # If verification is successful, issue JWT tokens and set cookies
        refresh = RefreshToken.for_user(user)
        response = Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)

        set_jwt_cookies(response, refresh.access_token, refresh)

        # Clear any temporary login state if used

        return response

class RequestPasswordResetView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RequestPasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password reset email sent.'}, status=status.HTTP_200_OK)

class ResetPasswordView(generics.UpdateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ResetPasswordSerializer

    def post(self, request, uidb64, token, *args, **kwargs):
        # Pass uidb64 and token from URL to serializer context
        serializer = self.serializer_class(data=request.data, context={'request': request, 'kwargs': {'uidb64': uidb64, 'token': token}})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password has been reset.'}, status=status.HTTP_200_OK)

class TwoFactorSetupView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        # Generate and return 2FA secret and QR code for the authenticated user
        serializer = TwoFactorSetupSerializer(instance=request.user)
        setup_data = serializer.update(request.user, {})
        return Response(setup_data, status=status.HTTP_200_OK)

class TwoFactorToggleView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TwoFactorToggleSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=request.user, data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        status_message = "enabled" if user.is_2fa_enabled else "disabled"
        return Response({'detail': f'Two-factor authentication {status_message}.', 'is_2fa_enabled': user.is_2fa_enabled}, status=status.HTTP_200_OK)

# You might need a view to get user details, potentially including 2FA status
class UserDetailsView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SignupSerializer # You might want a different serializer for user details

    def get_object(self):
        return self.request.user
