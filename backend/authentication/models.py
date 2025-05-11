from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Add fields for 2FA
    is_2fa_enabled = models.BooleanField(default=False)
    twofa_secret = models.CharField(max_length=255, blank=True, null=True)

    # Add any other custom fields here

    def __str__(self):
        return self.username
