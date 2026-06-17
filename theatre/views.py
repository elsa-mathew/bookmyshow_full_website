from django.shortcuts import render,redirect
from rest_framework.decorators import api_view
from django.contrib.auth.models import User 
from .models import Theatre , Screen , Section ,Language, Genre , Movie , Cast , Crew
from authenticate.models import UserProfile
from rest_framework.response import Response
from .serializers import TheatreSerializer , ScreenSerializer , SectionSerializer
def dashboard(request):
    
    context = {
        'total_screens': 0,
        'total_shows': 0,
        'today_bookings': 0,
        'revenue': 0,
        'recent_shows': []
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


    return render(
        request,
        'theatre/movies.html'
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

        # Languages

        language_ids = request.data.getlist(
            'languages'
        )

        movie.languages.set(

            Language.objects.filter(
                id__in=language_ids
            )

        )

        # Genres

        genre_ids = request.data.getlist(
            'genres'
        )

        movie.genres.set(

            Genre.objects.filter(
                id__in=genre_ids
            )

        )

        # Cast

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

        # Crew

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