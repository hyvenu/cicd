from rest_framework import serializers
from . import models


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Cart
        fields = ['user', 'product', 'qty', 'sub_total']


class WishListSerializer(serializers.ModelSerializer):

    class Meta:
        models = models.WishList
        fields = ['user', 'product']

class RatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Rating
        fields = ['id','user', 'product','rating', 'comment','isdelete']

# class ProductSerializer(serializers.)