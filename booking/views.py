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
from django.utils import timezone


@api_view(['POST'])
def create_booking(request):
    print("request.data =", request.data)
    show_id = request.data.get("show_id")
    print("SHOW ID RECEIVED:", show_id)
    total_amount = request.data.get("total_amount")
    seat_ids = request.data.get("seat_ids")
    
    
    show = Show.objects.get(id=show_id)

    print("----------------")
    print("SHOW ID RECEIVED:", show_id)
    print("SHOW OBJECT:", show.id)
    print("USER:", request.user)
    
    existing = BookedSeat.objects.filter(

        show=show,

        seat_id__in=seat_ids,

        booking__booking_status="confirmed"

    )

    if existing.exists():

        return Response(
            {
                "error":
                "One or more seats are already booked."
            },
            status=400
        )


    booking = Booking.objects.create(

        user=request.user,

        show=show,

        total_amount=total_amount,

        booking_status="confirmed"

    )

  
    for seat_id in seat_ids:
        print("Saving Seat:", seat_id, "for Show:", show.id)

        BookedSeat.objects.create(

            booking=booking,

            show=show,

            seat_id=seat_id

        )

    return Response({

        "message": "Booking Created",

        "booking_id": booking.id

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

    return render(request,'booking/payment.html', context)



def ticket_page(request,booking_id):

    booking =get_object_or_404(
            Booking.objects.select_related(
                'show',
                'show__movie',
                'show__screen',
                'show__screen__theatre'
            ),
            id=booking_id
        )

    booked_seats =BookedSeat.objects.filter(booking=booking).select_related('seat')

    context = {

        'booking':booking,
        'booked_seats':booked_seats

    }

    return render(request,'booking/ticket.html',context)


from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def cancel_booking(request, id):

    try:

        booking = Booking.objects.get(
            id=id,
            user=request.user
        )

    except Booking.DoesNotExist:

        return Response(
            {
                "error":
                "Booking not found"
            },
            status=404
        )

    if booking.booking_status == 'cancelled':

        return Response(
            {
                "error":
                "Ticket already cancelled"
            },
            status=400
        )

    show_datetime = datetime.combine(

        booking.show.show_date,

        booking.show.start_time

    )

    show_datetime = timezone.make_aware(
        show_datetime
    )

    if (
        show_datetime - timezone.now()
    ) <= timedelta(minutes=30):

        return Response(
            {
                "error":
                "Cancellation period expired"
            },
            status=400
        )

    booking.booking_status = 'cancelled'

    booking.cancelled_at = timezone.now()

    booking.save()

    BookedSeat.objects.filter(booking=booking).delete()

    return Response(
        {
            "message":
            "Ticket cancelled successfully"
        }
    )



@api_view(['GET'])
def get_booked_seats(request, show_id):

    print("GET_BOOKED_SEATS CALLED")
    print("SHOW =", show_id)

    booked_seats = BookedSeat.objects.filter(
        show_id=show_id,
        booking__booking_status="confirmed"
    )

    print(
        "RESULT =",
        list(booked_seats.values_list("seat_id", flat=True))
    )

    return Response(
        list(booked_seats.values_list("seat_id", flat=True))
    )

from django.shortcuts import render
from django.utils import timezone
from datetime import datetime, timedelta

from booking.models import Booking, BookedSeat


def my_bookings(request):

    bookings = (
        Booking.objects
        .filter(user=request.user)
        .select_related(
            "show",
            "show__movie",
            "show__screen",
            "show__screen__theatre"
        )
        .order_by("-created_at")
    )

    total_bookings = bookings.count()

    confirmed_bookings = bookings.filter(
        booking_status="confirmed"
    ).count()

    cancelled_bookings = bookings.filter(
        booking_status="cancelled"
    ).count()

    upcoming_bookings = 0

    for booking in bookings:

        show_datetime = timezone.make_aware(

            datetime.combine(

                booking.show.show_date,

                booking.show.start_time

            )

        )

        end_datetime = timezone.make_aware(

            datetime.combine(

                booking.show.show_date,

                booking.show.end_time

            )

        )

        seats = BookedSeat.objects.filter(
            booking=booking
        ).select_related("seat")

        booking.seat_list = ", ".join(

            f"{seat.seat.row_name}{seat.seat.seat_number}"

            for seat in seats

        )

        booking.can_cancel = (

            booking.booking_status == "confirmed"

            and

            timezone.now() < show_datetime - timedelta(minutes=30)

        )

        booking.can_view_ticket = (

            booking.booking_status == "confirmed"

            and

            timezone.now() <= end_datetime

        )

        booking.is_expired = (

            booking.booking_status == "confirmed"

            and

            timezone.now() > end_datetime

        )

        if booking.can_view_ticket:

            upcoming_bookings += 1

    context = {

        "bookings": bookings,

        "total_bookings": total_bookings,

        "confirmed_bookings": confirmed_bookings,

        "cancelled_bookings": cancelled_bookings,

        "upcoming_bookings": upcoming_bookings,

    }

    return render(
        request,
        "booking/my_bookings.html",
        context
    )