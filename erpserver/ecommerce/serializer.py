from rest_framework import serializers
from . import models


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Cart
        fields = ['user','product','qty','sub_total']


# class ProductSerializer(serializers.)