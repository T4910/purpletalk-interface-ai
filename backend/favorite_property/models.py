from django.db import models
from django.conf import settings

class PropertySnapshot(models.Model):
    """
    Periodic snapshot of a property's data (e.g. price, status).
    """
    # property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='snapshots')
    location = models.CharField(max_length=255, blank=True, null=True)
    details_url = models.URLField()
    image_url = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    bedroom = models.IntegerField(blank=True, null=True)
    bathroom = models.IntegerField(blank=True, null=True)
    listing_time = models.DateTimeField(blank=True, null=True) # map to listing
    amenities = models.JSONField(blank=True, null=True)
    property_type = models.CharField(max_length=255, blank=True, null=True)
    contact = models.CharField(max_length=255, blank=True, null=True) # map to phonenumber
    scraped_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    # status = models.CharField(max_length=100, default='active')  # e.g. 'active', 'sold', 'rented', etc.
    extra_data = models.JSONField(blank=True, null=True)  # for additional metadata
    initiator = models.CharField(max_length=10, choices=([
        ('system', 'System'),
        ('user', 'User')
    ]), default='system') 

    def __str__(self):
        return f"Snapshot for {self.property} at {self.scraped_at}"


class FavoriteProperty(models.Model):
    """
    Maps a user to a property they've favorited and how often it should be checked.
    """
    CHECK_INTERVAL_CHOICES = [
        ('none', 'Do not auto-check'),
        ('6h', 'Every 6 hours'),
        ('12h', 'Every 12 hours'),
        ('24h', 'Every day'),
        ('72h', 'Every 3 days'),
        ('7d', 'Every week'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_properties')
    property = models.ForeignKey(PropertySnapshot, on_delete=models.CASCADE, related_name='favorited_by')
    added_at = models.DateTimeField(auto_now_add=True)
    check_frequency = models.CharField(max_length=4, choices=CHECK_INTERVAL_CHOICES, default='none')

    class Meta:
        unique_together = ('user', 'property')
        indexes = [
            models.Index(fields=['user', 'check_frequency']),
            models.Index(fields=['property']),
        ]

    def __str__(self):
        return f"{self.user.email} favorites {self.property}"
