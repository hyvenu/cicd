from rest_framework import serializers

from . import models
from .models import Store


class StoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Store
        fields = [
            "id",
            "store_name",
            "address",
            "city",
            "pin_code",
            "gst_no"
        ]

class StoreUserSerializer(serializers.ModelSerializer):
    store = StoreSerializer(many=False, read_only=True)
    class Meta:
        model = models.StoreUser
        fields = [
            "id",
            "user",
            "store",
        ]
