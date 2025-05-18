# Suggested code may be subject to a license. Learn more: ~LicenseLog:355450031.
# Suggested code may be subject to a license. Learn more: ~LicenseLog:2292179220.
from django.db import models, IntegrityError
from django.conf import settings
from django.utils import timezone

import string
import random

def generate_alphanumeric_id(length=16):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

class Conversation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    session_id = models.CharField(max_length=255, unique=True, default=generate_alphanumeric_id)

    # Refactor later
    # This ensures session_ids are always unique
    def save(self, *args, **kwargs):
        if not self.session_id:
            for _ in range(5):  # retry 5 times
                self.session_id = generate_alphanumeric_id()
                try:
                    super().save(*args, **kwargs)
                    return
                except IntegrityError:
                    continue
            raise IntegrityError("Could not generate a unique session_id")
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"Conversation with {self.user.username} ({self.id})"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20) # 'user' or 'assistant'
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.sender}: {self.content[:50]}..."

    class Meta:
        ordering = ['timestamp']
