from django.urls import path
from . import views

urlpatterns = [

    path('payment/',views.payment_page,name='payment_page'),
    path('create-booking/', views.create_booking,name='create_booking'),
    path('ticket/<int:booking_id>/',views.ticket_page,name='ticket_page'),
    path('cancel-booking/<int:id>/',views.cancel_booking,name='cancel_booking'),
    path('booked-seats/<int:show_id>/',views.get_booked_seats,name="booked_seats"),
    path(
    "my-bookings/",
    views.my_bookings,
    name="my_bookings"
),
    
]