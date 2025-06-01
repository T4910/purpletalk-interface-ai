# serializers.py

from rest_framework import serializers
from .models import FavoriteProperty, PropertySnapshot

class PropertySnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertySnapshot
        fields = "__all__"  # or list the fields you want

class FavoritePropertySerializer(serializers.ModelSerializer):
    property = PropertySnapshotSerializer(read_only=True)  # <-- Expand property

    class Meta:
        model = FavoriteProperty
        fields = "__all__"  # or list fields you want: id, user, property, added_at, check_frequency
