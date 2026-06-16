from django.shortcuts import render,redirect
from rest_framework.decorators import api_view
from django.contrib.auth.models import User 
from .models import Theatre
from authenticate.models import UserProfile
from rest_framework.response import Response
from .serializers import TheatreSerializer 
def dashboard(request):
    
    user = request.user
    context = {
        'user' : user
    }
    return render(request,'theatre/theatre_dashboard.html', context)



@api_view(['POST'])
def add_theatre(request):

    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    theatre_name = request.data.get('theatre_name')
    location = request.data.get('location')
    phone = request.data.get('phone')
    status = request.data.get('status')

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    UserProfile.objects.create(
    user=user,
    role="theatre"
)

    theatre = Theatre.objects.create(
        owner=user,
        theatre_name=theatre_name,
        location=location,
        phone=phone,
        email=email,
        status=status
    )

    return Response({
        "message": "Theatre created successfully"
    })

@api_view(['GET'])
def get_theatres(request):

    theatres = Theatre.objects.all()

    serializer = TheatreSerializer(
        theatres,
        many=True
    )

    return Response(serializer.data)

@api_view(['PUT'])
def update_theatre(request, id):

    theatre = Theatre.objects.get(id=id)

    theatre.theatre_name = request.data.get('theatre_name')
    theatre.location = request.data.get('location')
    theatre.phone = request.data.get('phone')
    theatre.status = request.data.get('status')

    theatre.save()

    return Response({
        "message":"Theatre updated"
    })

@api_view(['DELETE'])
def delete_theatre(request, id):

    theatre = Theatre.objects.get(id=id)

    theatre.delete()

    return Response({
        "message":"Theatre deleted"
    })