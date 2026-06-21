from django.shortcuts import render
from booking.models import Booking, BookedSeat
from theatre.models import Show, Seat
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from theatre.models import Show
from booking.models import Booking
from django.shortcuts import (
    render,
    get_object_or_404
)

@api_view(['POST'])
def create_booking(request):

    show_id = request.data.get(
        'show_id'
    )

    total_amount = request.data.get(
        'total_amount'
    )

    seat_ids = request.data.get(
        'seat_ids'
    )

    show = Show.objects.get(
        id=show_id
    )

    booking = Booking.objects.create(

        user=request.user,

        show=show,

        total_amount=total_amount,

        booking_status='confirmed'

    )

    for seat_id in seat_ids:

        seat = Seat.objects.get(
            id=seat_id
        )

        BookedSeat.objects.create(

            booking=booking,

            show=show,

            seat=seat

        )

    print(
        "BOOKING ID:",
        booking.id
    )

    return Response({

        "booking_id":
            booking.id,

        "message":
            "Booking Created"

    })



def payment_page(request):

    show_id = request.GET.get('show_id')

    show = Show.objects.select_related(
        'movie',
        'screen',
        'screen__theatre'
    ).get(id=show_id)

    context = {
        'show': show
    }

    return render(
        request,
        'booking/payment.html',
        context
    )



def ticket_page(
    request,
    booking_id
):

    booking =get_object_or_404(
            Booking.objects.select_related(
                'show',
                'show__movie',
                'show__screen',
                'show__screen__theatre'
            ),
            id=booking_id
        )

    booked_seats =BookedSeat.objects.filter(
            booking=booking
        ).select_related(
            'seat'
        )

    context = {

        'booking':
            booking,

        'booked_seats':
            booked_seats

    }

    return render(
        request,
        'booking/ticket.html',
        context
    )