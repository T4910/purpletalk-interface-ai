# Suggested code may be subject to a license. Learn more: ~LicenseLog:2101765244.
# Suggested code may be subject to a license. Learn more: ~LicenseLog:967205475.
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode, urlencode
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from .serializers import (
    SignupSerializer,
    LoginSerializer,
    RequestPasswordResetSerializer,
    ResetPasswordSerializer,
    TwoFactorSetupSerializer,
    TwoFactorVerifySerializer,
    TwoFactorToggleSerializer,
    EmailConfirmationSerializer,
    ResendEmailConfirmationSerializer, # Import the new serializer
    UserDetailsSerializer
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

# Helper function to unset JWT cookies
def unset_jwt_cookies(response):
    response.delete_cookie(settings.SIMPLE_JWT['JWT_AUTH_COOKIE'])
    response.delete_cookie(settings.SIMPLE_JWT['JWT_AUTH_REFRESH_COOKIE'])
    return response

class SignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        # Send confirmation email after user creation
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Construct the confirmation URL
        # This should point to your frontend page that hits the confirmation endpoint
        query_params = urlencode({'uid': uid, 'token': token})
        confirmation_url = f"{settings.FRONTEND_URL}/verify-email?{query_params}"

        subject = "Confirm Your Email Address"
        message = render_to_string('authentication/email_confirmation_email.txt', {
            'user': user,
            'confirmation_url': confirmation_url,
        })
        print(message.replace('&amp;','&'), 564454556)
        send_mail(subject, message.replace('&amp;','&'), settings.DEFAULT_FROM_EMAIL, [user.email])


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']

        if user.is_2fa_enabled:
            response = Response({'detail': '2FA required.', 'user_id': user.id}, status=status.HTTP_200_OK)
            return response
        
        refresh = RefreshToken.for_user(user)
        response = Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)

        set_jwt_cookies(response, refresh.access_token, refresh)

        return response

class LogoutView(APIView):
    permission_classes = (AllowAny,) # Allow logging out even if token is expired

    def post(self, request, *args, **kwargs):
        response = Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        unset_jwt_cookies(response)
        return response


class TwoFactorVerifyView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
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

        refresh = RefreshToken.for_user(user)
        response = Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)

        set_jwt_cookies(response, refresh.access_token, refresh)

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
        serializer = self.serializer_class(data=request.data, context={'request': request, 'kwargs': {'uidb64': uidb64, 'token': token}})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password has been reset.'}, status=status.HTTP_200_OK)

class TwoFactorSetupView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
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

class EmailConfirmationView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = EmailConfirmationSerializer

    def post(self, request, *args, **kwargs):
        # Use POST to receive uidb64 and token from the frontend after the user clicks the link
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Email confirmed successfully.'}, status=status.HTTP_200_OK)

class ResendEmailConfirmationView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = ResendEmailConfirmationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Confirmation email sent.'}, status=status.HTTP_200_OK)

class UserDetailsView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserDetailsSerializer

    def get_object(self):
        return self.request.user
