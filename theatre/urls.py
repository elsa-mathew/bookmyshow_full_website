from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard,name='dashboard'),
    path('api/theatres/add/',views.add_theatre,name='add_theatre'),
    path('api/theatres/',views.get_theatres,name='get_theatres'),
    path('api/theatres/update/<int:id>/',views.update_theatre,name='update_theatre'),
    path('api/theatres/delete/<int:id>/',views.delete_theatre,name='delete_theatre'),
    path('screens/',views.screen_list,name='screen_list'),
    path('api/screens/add/',views.add_screen,name='add_screen'),
    path('api/screens/',views.get_screens,name='get_screens'),
    path('api/screens/update/<int:id>/',views.update_screen,name='update_screen'),
    path(
    'api/screens/delete/<int:id>/',
    views.delete_screen,
    name='delete_screen'
),
    path(
    'api/sections/add/',
    views.add_section,
    name='add_section'
),

    path(
    'api/sections/<int:screen_id>/',
    views.get_sections,
    name='get_sections'
),

    path(
    'api/sections/update/<int:id>/',
    views.update_section,
    name='update_section'
),
    path(
    'api/sections/delete/<int:id>/',
    views.delete_section,
    name='delete_section'
),
path('movies/',views.movie_list,name='movie_list'),
path(
        'api/languages/',
        views.get_languages,
        name='get_languages'
    ),

   path(
        'api/genres/',
        views.get_genres,
        name='get_genres'
    ),
    path(
    'api/languages/add/',
    views.add_language,
    name='add_language'
),

    path(
    'api/languages/update/<int:id>/',
    views.update_language
),

    path(
    'api/languages/delete/<int:id>/',
    views.delete_language
),

    path(
    'api/genres/',
    views.get_genres
),

path(
    'api/genres/add/',
    views.add_genre
),

path(
    'api/genres/update/<int:id>/',
    views.update_genre
),

path(
    'api/genres/delete/<int:id>/',
    views.delete_genre
),
    path(
    'api/movies/add/',
    views.add_movie
),
]