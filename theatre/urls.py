from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard),
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
]