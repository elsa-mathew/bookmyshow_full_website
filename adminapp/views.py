from django.shortcuts import render,redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Subcatagories
from .serializers import CategorySerializer , SubcatagoriesSerializer
from rest_framework import status
from django.contrib.auth import logout
from django.contrib.auth.models import User
from theatre.models import Theatre, Movie
from booking.models import Booking
from django.db.models import Sum
from django.db.models import (Count,Sum)
from django.utils import timezone
from authenticate.decorators import admin_required

@admin_required
def dashboard(request):

    total_users = User.objects.filter(is_superuser=False).count()
    total_theatres = Theatre.objects.count()
    total_movies = Movie.objects.count()
    total_bookings = Booking.objects.count()
    total_revenue = (Booking.objects.filter(booking_status='confirmed').aggregate(total=Sum('total_amount'))['total']or 0)
    user = request.user
    recent_bookings = (Booking.objects.select_related('user','show','show__movie').order_by('-created_at')[:10])
    context = {
        'total_users': total_users,
        'total_theatres': total_theatres,
        'total_movies': total_movies,
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'user' : user,
        'recent_bookings':recent_bookings
    }
    return render(request,'admin/admin_dashboard.html', context)



def category_list(request):

    categories = Category.objects.all()
    context = {'categories': categories}

    return render(request,'admin/category_list.html',context)



@api_view(['GET'])
def get_categories(request):

    categories = Category.objects.all()
    serializer = CategorySerializer(categories,many=True)
    return Response(serializer.data)



@api_view(['POST'])
def add_category(request):

    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )



@api_view(['PUT'])
def update_category(request, id):

    category = Category.objects.get(id=id)
    serializer = CategorySerializer(category,data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)



@api_view(['DELETE'])
def delete_category(request, id):

    try:

        category = Category.objects.get(id=id)

        if Subcatagories.objects.filter(category=category).exists():

            return Response(
                {
                    'error':
                    'Cannot delete category with subcategories'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        category.delete()

        return Response(
            {
                'message':
                'Category deleted successfully'
            },
            status=status.HTTP_200_OK
        )

    except Category.DoesNotExist:

        return Response(
            {
                'error':
                'Category not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    


@api_view(['GET'])
def get_subcategories(request, category_id):

    subcategories = Subcatagories.objects.filter(
        category_id=category_id
    )

    serializer = SubcatagoriesSerializer(
        subcategories,
        many=True
    )

    return Response(serializer.data)



@api_view(['POST'])
def add_subcategory(request):

    print("REQUEST DATA:", request.data)
    serializer = SubcatagoriesSerializer(
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=201
        )

    print("ERRORS:", serializer.errors)

    return Response(
        serializer.errors,
        status=400
    )



@api_view(['PUT'])
def update_subcategory(request, id):

    try:

        subcategory = Subcatagories.objects.get(id=id)
        serializer = SubcatagoriesSerializer(
            subcategory,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )

    except Subcatagories.DoesNotExist:

        return Response(
            {"error": "Subcategory not found"},
            status=404
        )


@admin_required
def theatre_list(request):
    
    return render(request,'admin/theatre_list.html')



def logout_view(request):

    logout(request)

    return redirect('login')



@api_view(['DELETE'])
def delete_subcategory(request, id):

    try:

        subcategory = Subcatagories.objects.get(id=id)
        subcategory.delete()
        return Response(
            {
                "message":
                "Subcategory deleted successfully"
            }
        )

    except Subcatagories.DoesNotExist:

        return Response(
            {
                "error":
                "Subcategory not found"
            },
            status=404
        )



@admin_required
def booking_dashboard(request):

    today = timezone.now().date()
    total_bookings = (Booking.objects.count()
    )
    todays_bookings = (Booking.objects.filter(created_at__date=today).count()
    )
    confirmed_bookings = (Booking.objects.filter(booking_status='confirmed').count()
    )
    todays_revenue = (Booking.objects.filter(created_at__date=today,booking_status='confirmed').aggregate(total=Sum('total_amount')
        )['total']or 0
    )
    total_revenue = (Booking.objects.filter(booking_status='confirmed').aggregate(total=Sum('total_amount'))['total']or 0
    )
    movie_stats = (Booking.objects.values('show__movie__movie_name').annotate(total_bookings=Count('id')).order_by('-total_bookings')[:10]
    )
    theatre_stats = (Booking.objects.values('show__screen__theatre__theatre_name').annotate(total_bookings=Count('id'),revenue=Sum('total_amount')
        ).order_by('-total_bookings')
    )
    top_users = (Booking.objects.values('user__username').annotate(total_bookings=Count('id')).order_by('-total_bookings')[:10])

    recent_bookings = (

        Booking.objects.select_related(
            'user',
            'show',
            'show__movie',
            'show__screen',
            'show__screen__theatre'
        )
        .order_by('-created_at')[:20]
    )

    context = {

        'total_bookings':total_bookings,
        'todays_bookings':todays_bookings,
        'confirmed_bookings':confirmed_bookings,
        'todays_revenue':todays_revenue,
        'total_revenue':total_revenue,
        'movie_stats':movie_stats,
        'theatre_stats':theatre_stats,
        'top_users':top_users,
        'recent_bookings':recent_bookings

    }

    return render(request,'admin/bookings.html',context)