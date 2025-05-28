from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode, urlencode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from .models import CustomUser
import pyotp
import base64
import io
import qrcode

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2')
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        # Create user as inactive by default
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=False # Set user as inactive
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Authenticate using username as the username
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)

            if not user:
                # If authentication failed, check if a user with this username exists but is inactive
                try:
                    user_by_username = CustomUser.objects.get(username=username)
                    if not user_by_username.is_active:         
                        # Generate and send a new confirmation email
                        
                        raise serializers.ValidationError(f'Looks like you have not confirmed your email: [{user_by_username.email}]. Please check your inbox (spam as well).', code='authentication')
                except CustomUser.DoesNotExist:
                    # User with this username does not exist, or credentials are truly invalid
                    pass # Fall through to the general Invalid credentials error

                # If we reach here, it means authenticate returned None, and it wasn't because of an inactive user
                # This indicates invalid username/password combination
                raise serializers.ValidationError('Invalid credentials', code='authentication')

            # If authentication was successful, user object is returned and is_active is already checked
            # by Django's default backend during authentication (if it were the primary reason for failure)
            # but our explicit check above handles the case where the username is valid but not confirmed,
            # providing a better user message.

        else:
            raise serializers.ValidationError('Must include "username" and "password".', code='authentication')

        attrs['user'] = user
        return attrs

class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
            # if not user.is_active:
            #     raise serializers.ValidationError('Looks like you have not confirmed your email: . Please check your inbox (spam as well).', code='authentication')
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Construct the reset URL
        # In a real app, you would get the domain from request or settings
        # For this example, we'll use a placeholder. Replace with your frontend URL.
        query_params = urlencode({'uid': uid, 'token': token, 'email': user.email})
        reset_url = f"{settings.FRONTEND_URL}/reset-password?{query_params}"

        subject = "Password Reset Request"
        message = render_to_string('authentication/password_reset_email.txt', {
            'user': user,
            'reset_url': reset_url,
        })
        send_mail(subject, message.replace('&amp;','&'), settings.DEFAULT_FROM_EMAIL, [email])

class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        try:
            # Use force_str for decoding uid
            uid = force_str(urlsafe_base64_decode(attrs['uidb64']))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            raise serializers.ValidationError("Invalid token or user ID.")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError("Invalid token or user ID.")

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['password'])
        user.save()
        return user

class TwoFactorSetupSerializer(serializers.Serializer):
    def update(self, instance, validated_data):
        # Generate a new 2FA secret for the user
        secret = pyotp.random_base32()
        instance.twofa_secret = secret
        instance.save()

        # Generate the provisioning URI (for QR code)
        # Replace 'Realyze' with your app name if different
        uri = pyotp.totp.TOTP(secret).provisioning_uri(
            instance.email, issuer_name="Realyze")

        # Generate QR code (optional, can be done on frontend)
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
        qr.add_data(uri)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        qr_code_base64 = base64.b64encode(buffered.getvalue()).decode()

        return {
            "secret": secret,
            "qr_code": f"data:image/png;base64,{qr_code_base64}",
            "provisioning_uri": uri
            }

class TwoFactorVerifySerializer(serializers.Serializer):
    code = serializers.CharField(write_only=True)

    def validate_code(self, value):
        user = self.context['request'].user
        if not user.twofa_secret:
            raise serializers.ValidationError("2FA is not set up for this account.")

        totp = pyotp.totp.TOTP(user.twofa_secret)
        if not totp.verify(value):
            raise serializers.ValidationError("Invalid 2FA code.")

        return value

class TwoFactorToggleSerializer(serializers.Serializer):
    is_enabled = serializers.BooleanField()

    def update(self, instance, validated_data):
        instance.is_2fa_enabled = validated_data['is_enabled']
        # If disabling 2FA, remove the secret
        if not validated_data['is_enabled']:
            instance.twofa_secret = None
        instance.save()
        return instance

class EmailConfirmationSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        try:
            # Use force_str for decoding uid
            uid = force_str(urlsafe_base64_decode(attrs['uidb64']))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            raise serializers.ValidationError("Invalid link.")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError("Invalid link.")

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.is_active = True
        user.save()
        return user

class ResendEmailConfirmationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        
        if user.is_active:
            raise serializers.ValidationError("This email is already confirmed.")

        return value

    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        
        # Generate and send a new confirmation email
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        query_params = urlencode({'uid': uid, 'token': token, 'email': user.email})
        confirmation_url = f"{settings.FRONTEND_URL}/verify-email?{query_params}" # Use the same frontend URL

        subject = "Confirm Your Email Address"
        message = render_to_string('authentication/email_confirmation_email.txt', {
            'user': user,
            'confirmation_url': confirmation_url,
        })
        send_mail(subject, message.replace('&amp;','&'), settings.DEFAULT_FROM_EMAIL, [user.email])

# You might need a serializer for user details, potentially including 2FA status
class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'is_active', 'is_2fa_enabled') # Include is_active and is_2fa_enabled

# class UserDetailsView(generics.RetrieveAPIView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = UserDetailsSerializer # Use the new UserDetailsSerializer

#     def get_object(self):
#         return self.request.user
