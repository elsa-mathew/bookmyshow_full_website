from django.db import models
from django.contrib.auth.models import User
from theatre.models import Show , Seat


class Booking(models.Model):

    status_choice = (
        ('confirmed' , 'Confirmed'),
        ('cancelled' , 'Cancelled'),
        ('pending' , 'Pending'),
    )

    user = models.ForeignKey(User,on_delete=models.CASCADE)
    show = models.ForeignKey(Show,on_delete=models.CASCADE)
    total_amount = models.IntegerField()
    booking_status = models.CharField(max_length=20,choices=status_choice)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.show}"

class BookedSeat(models.Model):

    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,default=True
    )

    show = models.ForeignKey(
        Show,
        on_delete=models.CASCADE,default=1
    )

    seat = models.ForeignKey(
        Seat,
        on_delete=models.CASCADE,default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        unique_together = (
            'show',
            'seat'
        )

    
