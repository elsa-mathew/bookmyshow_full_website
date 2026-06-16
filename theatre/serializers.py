from rest_framework import serializers
from .models import Theatre , Screen , Section

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