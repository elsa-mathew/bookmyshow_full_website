from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard,name='dashboard'),
    path('movie/<int:id>/',views.movie_details,name='movie_details'),
    path('showtimes/<int:movie_id>/',views.showtimes,name='showtimes'),
    path(
    'seat-layout/<int:show_id>/',
    views.seat_layout,
    name='seat_layout'
)
]