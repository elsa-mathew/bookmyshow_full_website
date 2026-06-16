from rest_framework import serializers
from .models import Theatre

class TheatreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Theatre
        fields = '__all__'