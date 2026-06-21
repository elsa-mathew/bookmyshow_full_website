from django.shortcuts import render,redirect
from rest_framework.decorators import api_view
from django.contrib.auth.models import User 
from .models import Theatre , Screen , Section ,Language, Genre , Movie , Cast , Crew , Show
from authenticate.models import UserProfile
from rest_framework.response import Response
from .serializers import TheatreSerializer , ScreenSerializer , SectionSerializer
from django.contrib.auth import logout
from theatre.models import Theatre
from string import ascii_uppercase
from .models import Section, Seat
from django.db.models import Count , Sum
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from datetime import date
from datetime import datetime, timedelta
from rest_framework.decorators import (
    api_view,
    authentication_classes
)
from django.shortcuts import render
from django.db.models import Count, Sum
from django.utils import timezone

from theatre.models import (
    Theatre,
    Screen,
    Show
)

from booking.models import Booking

@authentication_classes([])
def dashboard(request):

    theatre = Theatre.objects.get(
        owner=request.user
    )

    today = timezone.now().date()

    screens = Screen.objects.filter(
        theatre=theatre
    )

    total_screens = screens.count()

    total_shows = Show.objects.filter(
        screen__theatre=theatre
    ).count()

    today_bookings = Booking.objects.filter(
        show__screen__theatre=theatre,
        created_at__date=today
    ).count()

    revenue = (
        Booking.objects.filter(
            show__screen__theatre=theatre,
            booking_status='confirmed'
        ).aggregate(
            total=Sum('total_amount')
        )['total']
        or 0
    )

    todays_shows = Show.objects.filter(
        screen__theatre=theatre,
        show_date=today
    ).select_related(
        'movie',
        'screen'
    )

    top_movies = (
        Booking.objects.filter(
            show__screen__theatre=theatre
        )
        .values(
            'show__movie__movie_name'
        )
        .annotate(
            booking_count=Count('id')
        )
        .order_by(
            '-booking_count'
        )[:5]
    )

    context = {

        'total_screens':
            total_screens,

        'total_shows':
            total_shows,

        'today_bookings':
            today_bookings,

        'revenue':
            revenue,

        'todays_shows':
            todays_shows,

        'top_movies':
            top_movies,

        'screens':
            screens

    }

    return render(
        request,
        'theatre/theatre_dashboard.html',
        context
    )

@api_view(['POST'])
@authentication_classes([])
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
@authentication_classes([])
def get_theatres(request):

    theatres = Theatre.objects.all()

    serializer = TheatreSerializer(
        theatres,
        many=True
    )

    return Response(serializer.data)

@api_view(['PUT'])
@authentication_classes([])
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
@authentication_classes([])
def delete_theatre(request, id):

    theatre = Theatre.objects.get(id=id)

    theatre.delete()

    return Response({
        "message":"Theatre deleted"
    })



@api_view(['POST'])
def add_screen(request):

    if not request.user.is_authenticated:

        return Response(
            {
                "error": "User not authenticated"
            },
            status=401
        )

    try:

        theatre = Theatre.objects.get(
            owner=request.user
        )

    except Theatre.DoesNotExist:

        return Response(
            {
                "error": "Theatre not found"
            },
            status=404
        )

    screen_name = request.data.get(
        'screen_name'
    )

    total_seats = request.data.get(
        'total_seats'
    )

    status = request.data.get(
        'status'
    )

    screen = Screen.objects.create(

        theatre=theatre,

        screen_name=screen_name,

        total_seats=total_seats,

        status=status

    )

    serializer = ScreenSerializer(
        screen
    )

    return Response(
        serializer.data,
        status=201
    )

def screen_list(request):

    print("SCREEN PAGE USER =", request.user)
    print("AUTH =", request.user.is_authenticated)

    return render(
        request,
        'theatre/screens.html'
    )

@api_view(['GET'])
def get_screens(request):

    theatre = Theatre.objects.get(
        owner=request.user
    )

    screens = Screen.objects.filter(
        theatre=theatre
    )

    serializer = ScreenSerializer(
        screens,
        many=True
    )

    return Response(
        serializer.data
    )

@api_view(['PUT'])
def update_screen(request, id):

    screen = Screen.objects.get(
        id=id
    )

    screen.screen_name = request.data.get(
        'screen_name'
    )

    screen.total_seats = request.data.get(
        'total_seats'
    )

    screen.status = request.data.get(
        'status'
    )

    screen.save()

    return Response({
        "message":"Screen Updated"
    })

@api_view(['DELETE'])
def delete_screen(request,id):

    screen = Screen.objects.get(
        id=id
    )

    screen.delete()

    return Response({
        "message":"Screen Deleted"
    })


@api_view(['POST'])
def add_section(request):

    print("ADD SECTION API HIT")

    screen_id = request.data.get(
        'screen_id'
    )

    screen = Screen.objects.get(
        id=screen_id
    )

    section = Section.objects.create(

        screen=screen,

        section_name=request.data.get(
            'section_name'
        ),

        price=request.data.get(
            'price'
        ),

        start_row=request.data.get(
            'start_row'
        ),

        end_row=request.data.get(
            'end_row'
        ),

        columns=request.data.get(
            'columns'
        ),

        status=request.data.get(
            'status'
        )

    )

    print("SECTION CREATED:", section.id)

    start = ascii_uppercase.index(
        section.start_row.upper()
    )

    end = ascii_uppercase.index(
        section.end_row.upper()
    )

    print("START:", start)
    print("END:", end)

    for row_index in range(start, end + 1):

        row_name = ascii_uppercase[row_index]

        print("ROW:", row_name)

        for seat_no in range(
            1,
            int(section.columns) + 1
        ):

            Seat.objects.create(
                section=section,
                row_name=row_name,
                seat_number=str(seat_no)
            )

    print("SEATS CREATED")

    serializer =SectionSerializer(
                        section
                    )

    return Response(
        serializer.data,
        status=201
    )

@api_view(['GET'])
def get_sections(request,screen_id):

    sections =Section.objects.filter(
            screen_id=screen_id
        )

    serializer =SectionSerializer(
            sections,
            many=True
        )

    return Response(
        serializer.data
    )

@api_view(['PUT'])
def update_section(request,id):

    section = Section.objects.get(
        id=id
    )

    section.section_name = request.data.get(
        'section_name'
    )

    section.price = request.data.get(
        'price'
    )

    section.start_row = request.data.get(
        'start_row'
    )

    section.end_row = request.data.get(
        'end_row'
    )

    section.columns = request.data.get(
        'columns'
    )

    section.status = request.data.get(
        'status'
    )

    section.save()

    return Response({
        "message":"Section Updated"
    })

@api_view(['DELETE'])
def delete_section(request,id):

    section = Section.objects.get(
        id=id)

    section.delete()

    return Response({
        "message":"Section Deleted"
    })

def movie_list(request):

    total_movies = Movie.objects.count()

    total_languages = Language.objects.count()

    total_genres = Genre.objects.count()

    movies = Movie.objects.all()

    context = {

        'total_movies':
            total_movies,

        'total_languages':
            total_languages,

        'total_genres':
            total_genres,

        'movies':
            movies

    }

    return render(
        request,
        'theatre/movies.html',
        context
    )

@api_view(['GET'])
def get_languages(request):

    languages = Language.objects.filter(
        status='active'
    )

    data = [

        {
            "id": language.id,
            "name": language.name,
            "status": language.status
        }

        for language in languages

    ]

    return Response(data)

@api_view(['GET'])
def get_genres(request):

    genres = Genre.objects.all()

    data = [

        {
            "id": genre.id,
            "name": genre.name,
            "status": genre.status
        }

        for genre in genres

    ]

    return Response(data)
@api_view(['POST'])
def add_language(request):

    language = Language.objects.create(

        name=request.data.get(
            'name'
        ),

        status=request.data.get(
            'status'
        )

    )

    return Response({
        "message":"Language Added"
    })

@api_view(['PUT'])
def update_language(request,id):

    language =Language.objects.get(
            id=id
        )

    language.name =request.data.get(
            'name'
        )

    language.status =request.data.get(
            'status'
        )

    language.save()

    return Response({
        "message":"Updated"
    })

@api_view(['DELETE'])
def delete_language(request,id):

    language =Language.objects.get(
            id=id
        )

    language.delete()

    return Response({
        "message":"Deleted"
    })

@api_view(['POST'])
def add_genre(request):

    genre = Genre.objects.create(

        name=request.data.get(
            'name'
        ),

        status=request.data.get(
            'status'
        )

    )

    return Response({
        "message":"Genre Added"
    })

@api_view(['PUT'])
def update_genre(request,id):

    genre = Genre.objects.get(
        id=id
    )

    genre.name = request.data.get(
        'name'
    )

    genre.status = request.data.get(
        'status'
    )

    genre.save()

    return Response({
        "message":"Updated"
    })

@api_view(['DELETE'])
def delete_genre(request,id):

    genre = Genre.objects.get(
        id=id
    )

    genre.delete()

    return Response({
        "message":"Deleted"
    })

@api_view(['POST'])
def add_movie(request):

    try:

        movie = Movie.objects.create(

            movie_name =
                request.data.get(
                    'movie_name'
                ),

            duration =
                request.data.get(
                    'duration'
                ),

            certificate =
                request.data.get(
                    'certificate'
                ),

            release_date =
                request.data.get(
                    'release_date'
                ),

            trailer =
                request.data.get(
                    'trailer'
                ),

            description =
                request.data.get(
                    'description'
                ),

            status =
                request.data.get(
                    'status'
                ),

            poster =
                request.FILES.get(
                    'poster'
                )

        )

  

        language_ids = request.data.getlist(
            'languages'
        )

        movie.languages.set(

            Language.objects.filter(
                id__in=language_ids
            )

        )

  

        genre_ids = request.data.getlist(
            'genres'
        )

        movie.genres.set(

            Genre.objects.filter(
                id__in=genre_ids
            )

        )

        index = 0

        while True:

            actor_name = request.data.get(
                f'cast[{index}][actor_name]'
            )

            if not actor_name:
                break

            Cast.objects.create(

                movie=movie,

                actor_name=actor_name,

                character_name=request.data.get(
                    f'cast[{index}][character_name]'
                ),

                actor_image=request.FILES.get(
                    f'cast[{index}][actor_image]'
                )

            )

            index += 1

        index = 0

        while True:

            name = request.data.get(
                f'crew[{index}][name]'
            )

            if not name:
                break

            Crew.objects.create(

                movie=movie,

                name=name,

                role=request.data.get(
                    f'crew[{index}][role]'
                ),

                image=request.FILES.get(
                    f'crew[{index}][image]'
                )

            )

            index += 1

        return Response({

            "message":
                "Movie Added Successfully"

        })

    except Exception as e:

        return Response({

            "error": str(e)

        }, status=400)


def show_list(request):

    total_movies = Movie.objects.count()

    today_shows = Show.objects.filter(
        show_date=date.today()
    ).count()

    active_screens = Screen.objects.filter(
        status='active'
    ).count()

    upcoming_shows = Show.objects.filter(
        show_date__gt=date.today()
    ).count()

    context = {

        'total_movies':
            total_movies,

        'today_shows':
            today_shows,

        'active_screens':
            active_screens,

        'upcoming_shows':
            upcoming_shows

    }

    return render(
        request,
        'theatre/shows.html',
        context
    )

@api_view(['GET'])
def get_movies(request):

    movies = Movie.objects.filter(
        status='active'
    )

    data = [

        {
            "id": movie.id,
            "movie_name": movie.movie_name
        }

        for movie in movies

    ]

    return Response(data)

@api_view(['GET'])
def get_screens(request):

    theatre = Theatre.objects.get(
        owner=request.user
    )

    screens = Screen.objects.filter(
        theatre=theatre,
        status='active'
    )

    serializer = ScreenSerializer(
        screens,
        many=True
    )

    return Response(
        serializer.data
    )


@api_view(['POST'])
def add_show(request):

    try:

        movie_id = request.data.get(
            'movie_id'
        )

        screen_id = request.data.get(
            'screen_id'
        )

        show_date = request.data.get(
            'show_date'
        )

        status = request.data.get(
            'status'
        )

        show_times = request.data.get(
            'show_times'
        )

        movie = Movie.objects.get(
            id=movie_id
        )

        screen = Screen.objects.get(
            id=screen_id
        )

        duration = movie.duration

        hours = 0
        minutes = 0

        if 'hr' in duration:

            hours = int(
                duration.split('hr')[0].strip()
            )

        if 'min' in duration:

            minutes = int(
                duration.split('hr')[1]
                .replace('min', '')
                .strip()
            )

        duration_delta = timedelta(
            hours=hours,
            minutes=minutes
        )

        for start_time_str in show_times:

            start_datetime = datetime.strptime(
                start_time_str,
                "%H:%M"
            )

            end_datetime = (
                start_datetime +
                duration_delta
            )

            Show.objects.create(

                movie=movie,

                screen=screen,

                show_date=show_date,

                start_time=start_datetime.time(),

                end_time=end_datetime.time(),

                status=status

            )

        return Response({

            "message":
                "Shows Added Successfully"

        })

    except Exception as e:

        return Response({

            "error": str(e)

        }, status=400)
    
def logout_view(request):

    logout(request)

    return redirect('login')


def booking_dashboard(request):

    theatre = Theatre.objects.get(
        owner=request.user
    )

    today = timezone.now().date()

    bookings = Booking.objects.filter(
        show__screen__theatre=theatre
    )

    total_bookings = bookings.count()

    todays_bookings = bookings.filter(
        created_at__date=today
    ).count()

    confirmed_bookings = bookings.filter(
        booking_status='confirmed'
    ).count()

    todays_revenue = (

        bookings

        .filter(
            created_at__date=today,
            booking_status='confirmed'
        )

        .aggregate(
            total=Sum('total_amount')
        )['total']

        or 0

    )

    total_revenue = (

        bookings

        .filter(
            booking_status='confirmed'
        )

        .aggregate(
            total=Sum('total_amount')
        )['total']

        or 0

    )

    movie_stats = (

        bookings

        .values(
            'show__movie__movie_name'
        )

        .annotate(
            total_bookings=Count('id'),
            revenue=Sum('total_amount')
        )

        .order_by(
            '-total_bookings'
        )[:10]

    )

    top_users = (

        bookings

        .values(
            'user__username'
        )

        .annotate(
            total_bookings=Count('id')
        )

        .order_by(
            '-total_bookings'
        )[:10]

    )

    recent_bookings = (

        bookings

        .select_related(
            'user',
            'show',
            'show__movie'
        )

        .order_by(
            '-created_at'
        )[:20]

    )

    context = {

        'total_bookings':
            total_bookings,

        'todays_bookings':
            todays_bookings,

        'confirmed_bookings':
            confirmed_bookings,

        'todays_revenue':
            todays_revenue,

        'total_revenue':
            total_revenue,

        'movie_stats':
            movie_stats,

        'top_users':
            top_users,

        'recent_bookings':
            recent_bookings

    }

    return render(
        request,
        'theatre/booking_dashboard.html',
        context
    )


@api_view(['GET'])
def language_movie_count(request):

    data = []

    languages = Language.objects.all()

    for language in languages:

        movie_count = language.movies.count()

        data.append({
            "language": language.language_name,
            "count": movie_count
        })

    return Response(data)


@api_view(['DELETE'])
@authentication_classes([])
def delete_movie(request,id):

    movie = Movie.objects.get(
        id=id
    )

    movie.delete()

    return Response({
        "message":"Movie Deleted"
    })
@api_view(['PUT'])
@authentication_classes([])
def update_movie(request, id):

    movie = Movie.objects.get(
        id=id
    )

    movie.movie_name = request.data.get(
        'movie_name'
    )

    movie.duration = request.data.get(
        'duration'
    )

    movie.certificate = request.data.get(
        'certificate'
    )

    movie.release_date = request.data.get(
        'release_date'
    )

    movie.trailer = request.data.get(
        'trailer'
    )

    movie.description = request.data.get(
        'description'
    )

    movie.status = request.data.get(
        'status'
    )

    movie.save()

    return Response({
        "message":
            "Movie Updated"
    })