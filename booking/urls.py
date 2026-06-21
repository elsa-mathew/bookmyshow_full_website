from django.urls import path
from . import views

urlpatterns = [

    path('payment/',views.payment_page,name='payment_page'),
    path('create-booking/', views.create_booking,name='create_booking'),
    path('ticket/<int:booking_id>/',views.ticket_page,name='ticket_page'),

]