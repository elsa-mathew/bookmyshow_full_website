from rest_framework import serializers
from .models import Category , Subcatagories

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'

class SubcatagoriesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subcatagories
        fields = '__all__'