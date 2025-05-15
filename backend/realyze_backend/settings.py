import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import timedelta

load_dotenv() # Load variables from .env file

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'a-fallback-secret-key-during-development-only') # Get from environment or use fallback

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True # Change to False in production

ALLOWED_HOSTS = [
    '127.0.0.1',
    'https://8000-firebase-realyze-1746969465034.cluster-oayqgyglpfgseqclbygurw4xd4.cloudworkstations.dev',
] # Add your production domain here


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework', # Django REST framework
    'rest_framework_simplejwt', # Simple JWT
    'corsheaders', # CORS headers
    
    'authentication', # Your authentication app
    'ai_agent', # AI agent app
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware', # CORS middleware
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


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

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

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'authentication.CustomUser'

# Django REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
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
    'JWT_AUTH_SAMESITE': 'Lax', # Or 'Strict' or 'None'
    # Change this back when you're done to not DEBUG
    'JWT_AUTH_SECURE': False, #not DEBUG, # Set to True in production (requires HTTPS)
    'JWT_AUTH_HTTPONLY': True, # Recommended for security
}

# CORS Headers Settings
CORS_ALLOWED_ORIGINS = [
    os.environ.get('FRONTEND_URL', 'http://localhost:8080'), # Get frontend URL from env or use fallback
    'https://8080-firebase-realyze-1746969465034.cluster-oayqgyglpfgseqclbygurw4xd4.cloudworkstations.dev'
    # Add other allowed origins in production
]

# Or allow all origins for development (not recommended for production)
CORS_ALLOW_ALL_ORIGINS = True

# Email Settings (for Gmail)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.environ.get('EMAIL_HOST_USER') # Often the same as EMAIL_HOST_USER

# Frontend URL (used in password reset email)
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173') # Get from env or use fallback for development
