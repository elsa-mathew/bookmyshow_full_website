from adminapp.models import Category
from theatre.models import Movie , Cast, Crew , Show , Section , Seat
from django.shortcuts import render , get_object_or_404
from datetime import date, timedelta
from booking.models import Booking

def dashboard(request):

    categories = Category.objects.filter(status='active')
    movies = Movie.objects.filter(status='active')

    context = {
        'categories': categories,
        'movies': movies
    }

    return render(request,'user/user_dashboard.html',context)




def movie_details(request, id):

    movie = Movie.objects.get(id=id)
    casts = Cast.objects.filter(movie=movie)

    context = {
        'movie': movie,
        'casts': casts
    }

    return render(request,'user/movies.html',context)





def showtimes(request, movie_id):

    movie = Movie.objects.get(id=movie_id)
    shows = Show.objects.filter(
        movie=movie,
        status='active'
    ).select_related(
        'screen',
        'screen__theatre'
    )

    sections = Section.objects.filter(
        screen__in=shows.values_list(
            'screen',
            flat=True
        ),
        status='active'
    ).distinct()

    context = {
        'movie': movie,
        'shows': shows,
        'sections': sections
    }

    return render(request,'user/show.html',context)



def showtimes(request, movie_id):

    movie = Movie.objects.get(id=movie_id)
    selected_date = request.GET.get('date')

    dates = []

    today = date.today()

    for i in range(7):

        dates.append(today + timedelta(days=i))

    if selected_date:

        shows = Show.objects.filter(
            movie=movie,
            show_date=selected_date,
            status='active'
        ).select_related(
            'screen',
            'screen__theatre'
        )

    else:

        shows = Show.objects.filter(
            movie=movie,
            show_date=today,
            status='active'
        ).select_related(
            'screen',
            'screen__theatre'
        )

    context = {
        'movie': movie,
        'shows': shows,
        'dates': dates,
        'selected_date': selected_date
    }

    return render(request,'user/show.html',context)




def seat_layout(request, show_id):

    show = get_object_or_404(
        Show.objects.select_related(
            'movie',
            'screen',
            'screen__theatre'
        ),
        id=show_id
    )

    sections = Section.objects.filter(
        screen=show.screen,
        status='active'
    ).prefetch_related(
        'seat_set'
    )

    print("SHOW ID:", show.id)
    print("SCREEN:", show.screen)
    print("SCREEN ID:", show.screen.id)

    all_sections = Section.objects.all()

    for s in all_sections:
        print(
            s.id,
            s.section_name,
            s.screen_id,
            s.status
        )
    
    print("SHOW SCREEN:", show.screen.id)

    print(
        "SECTIONS FOR THIS SCREEN:",
        Section.objects.filter(screen=show.screen).count()
    )

    context = {
        'show': show,
        'sections': sections
    }

    return render(request,'user/seat.html',context)


from django.shortcuts import render
from django.utils import timezone
from booking.models import Booking
from datetime import datetime
from booking.models import (
    Booking,
    BookedSeat
)

from datetime import (
    datetime,
    timedelta
)

from django.utils import timezone


def my_bookings(request):

    bookings = Booking.objects.filter(
        user=request.user
    ).select_related(
        'show',
        'show__movie',
        'show__screen',
        'show__screen__theatre'
    ).order_by(
        '-created_at'
    )

    total_bookings = bookings.count()

    confirmed_bookings = bookings.filter(
        booking_status='confirmed'
    ).count()

    cancelled_bookings = bookings.filter(
        booking_status='cancelled'
    ).count()

    upcoming_bookings = 0

    now = timezone.now()

    for booking in bookings:

        seats = BookedSeat.objects.filter(
            booking=booking
        )

        booking.seat_list = ", ".join(

            [

                f"{seat.seat.row_name}{seat.seat.seat_number}"

                for seat in seats

            ]

        )

        show_datetime = datetime.combine(

            booking.show.show_date,

            booking.show.start_time

        )

        show_datetime = timezone.make_aware(
            show_datetime
        )

        end_datetime = datetime.combine(

            booking.show.show_date,

            booking.show.end_time

        )

        end_datetime = timezone.make_aware(
            end_datetime
        )

        booking.is_expired = (
            now > end_datetime
        )

        booking.is_upcoming = (
            now < show_datetime
        )

        if booking.is_upcoming:

            upcoming_bookings += 1

        booking.can_cancel = (

            booking.booking_status == 'confirmed'

            and

            (
                show_datetime - now
            ) > timedelta(
                minutes=30
            )

        )

        booking.can_view_ticket = (

            booking.booking_status == 'confirmed'

            and

            not booking.is_expired

        )

    context = {

        'bookings':
            bookings,

        'total_bookings':
            total_bookings,

        'confirmed_bookings':
            confirmed_bookings,

        'cancelled_bookings':
            cancelled_bookings,

        'upcoming_bookings':
            upcoming_bookings

    }

    return render(

        request,

        'user/my_bookings.html',

        context

    )
