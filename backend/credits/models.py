# credits/models.py
from django.db import models
from django.conf import settings


class CreditWallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_credits = models.FloatField(default=2)
    updated_at = models.DateTimeField(auto_now=True)


class CreditTransaction(models.Model):
    TRANSACTION_TYPES = (
        ("add", "Add"),
        ("deduct", "Deduct"),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.FloatField()
    reason = models.CharField(max_length=255)
    transaction_type = models.CharField(choices=TRANSACTION_TYPES, max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)
