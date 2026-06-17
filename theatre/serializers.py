from rest_framework import serializers
from .models import Theatre , Screen , Section , Movie

class TheatreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Theatre
        fields = '__all__'

class ScreenSerializer(serializers.ModelSerializer):

    class Meta:

        model = Screen

        fields = '__all__'

class SectionSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Section

        fields = "__all__"

class MovieSerializer(serializers.ModelSerializer):

    class Meta:

        model = Movie

        fields = '__all__'