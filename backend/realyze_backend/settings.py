import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import timedelta

load_dotenv() # Load variables from .env file

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'a-fallback-secret-key-during-development-only') # Get from environment or use fallback

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = not os.environ.get('PRODUCTION', True) # Change to False in production

# Frontend URL (used in password reset email) & Backend URL
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:8080') # Get from env or use fallback for developmenth
HOST_URL = os.environ.get('HOST_URL', 'http://localhost:8000') # Get from env or use fallback for developmenth

ALLOWED_HOSTS = [HOST_URL, 'http://localhost:8000'] # Add your production domain here

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# CORS Headers Settings
CORS_ALLOWED_ORIGINS = [os.environ.get("FRONTEND_URL"), 'http://localhost:8080']
CORS_ALLOW_CREDENTIALS = True

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'corsheaders', # CORS headers
    'rest_framework', # Django REST framework
    'rest_framework_simplejwt', # Simple JWT
    
    'authentication', # Your authentication app
    'chat', # Chat app
    'ai_agent', # AI agent app
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # CORS middleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'realyze_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'], # Add a project-level templates directory if needed
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'realyze_backend.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DATABASE_NAME'),
        'USER': os.environ.get('DATABASE_USER'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD'),
        'HOST': os.environ.get('DATABASE_HOST'),
        'PORT': os.environ.get('DATABASE_PORT', ''), # Use empty string as default for port if not set
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'authentication.CustomUser'

# Django REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
        'authentication.authentication.CustomJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated', # Default to authenticated users
    ) # You can override this per view
}

# Simple JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5), # Adjust as needed
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1), # Adjust as needed
    'ROTATE_REFRESH_TOKENS': False, # Turn to true when you've set it up. Let's see what happens
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY, # SECRET_KEY is now loaded from .env
    'VERIFYING_KEY': '',
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'django.contrib.auth.get_user_model',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5), # Adjust as needed
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1), # Adjust as needed

    # Cookie Settings
    'JWT_AUTH_COOKIE': 'access_token', # Name of the cookie for access token
    'JWT_AUTH_REFRESH_COOKIE': 'refresh_token', # Name of the cookie for refresh token
    'JWT_AUTH_SAMESITE': 'Lax', # Or 'Strict' or 'None' or 'Lax'
    # 'JWT_COOKIE_DOMAIN': domain,

    'JWT_AUTH_SECURE': True, #not DEBUG, # Set to True in production (requires HTTPS)
    'JWT_AUTH_HTTPONLY': True, # Recommended for security
}

# Email Settings (for Gmail)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.environ.get('EMAIL_HOST_USER') # Often the same as EMAIL_HOST_USER
