from django.urls import path
from rest_framework_simplejwt.views import ( # No-qa
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import (
    SignupView,
    LoginView,
    RequestPasswordResetView,
    ResetPasswordView,
    TwoFactorSetupView,
    TwoFactorVerifyView,
    TwoFactorToggleView,
    UserDetailsView,
    EmailConfirmationView,
    ResendEmailConfirmationView,
    LogoutView, # Import the new view
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'), # New URL pattern
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # No-qa
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'), # No-qa
    path('password-reset/', RequestPasswordResetView.as_view(), name='request_password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', ResetPasswordView.as_view(), name='password_reset_confirm'),
    path('2fa/setup/', TwoFactorSetupView.as_view(), name='two_factor_setup'),
    path('2fa/verify/', TwoFactorVerifyView.as_view(), name='two_factor_verify'),
    path('2fa/toggle/', TwoFactorToggleView.as_view(), name='two_factor_toggle'),
    path('user/', UserDetailsView.as_view(), name='user_details'),
    path('verify-email/', EmailConfirmationView.as_view(), name='email_confirmation'),
    path('resend-verify-email/', ResendEmailConfirmationView.as_view(), name='resend_email_confirmation'),
]
