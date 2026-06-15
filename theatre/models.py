from django.db import models
from django.contrib.auth.models import User

class Theatre(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
    )

    owner = models.ForeignKey(User,on_delete=models.CASCADE)
    theatre_name = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=50)
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            'owner' , 'theatre_name'
        )

    def __str__(self):
        return f"{self.owner} - {self.theatre_name}"


class Screen(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
    )

    theatre = models.ForeignKey(Theatre,on_delete=models.CASCADE)
    screen_name = models.CharField(max_length=50)
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            'theatre' , 'screen_name'
        )

    def __str__(self):
        return f"{self.theatre} - {self.screen_name}"


class Section(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
    )

    screen = models.ForeignKey(Screen,on_delete=models.CASCADE)
    section_name = models.CharField(max_length=50)
    price = models.IntegerField()
    start_row = models.CharField(max_length=10)
    end_row = models.CharField(max_length=10)
    columns = models.IntegerField()
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            'screen' , 'section_name'
        )

    def __str__(self):
        return f"{self.screen} - {self.section_name}"
    
class Seat(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
    )

    section = models.ForeignKey(Section,on_delete=models.CASCADE)
    seat_number = models.CharField(max_length=10)
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            'section' , 'seat_number'
        )

    def __str__(self):
        return f"{self.section} - {self.seat_number}"


class Language(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
    )

    name = models.CharField(max_length=50,unique=True)
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name 
    

class Genre(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
    )

    name = models.CharField(max_length=50,unique=True)
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name 
    
class Movie(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
    )

    CERTIFICATE_CHOICES = (
    ('U', 'U'),
    ('UA', 'UA'),
    ('A', 'A'),
)
    
    movie_name = models.CharField(max_length=50)
    duration = models.CharField(max_length=50)
    languages = models.ManyToManyField(Language)
    genres = models.ManyToManyField(Genre)
    certificate = models.CharField(max_length=20,choices=CERTIFICATE_CHOICES)
    release_date = models.DateField()
    poster = models.ImageField(upload_to='movies/')
    trailer = models.URLField()
    description = models.TextField()
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.movie_name 
    
class Cast(models.Model):

    movie = models.ForeignKey(Movie,on_delete=models.CASCADE)
    actor_name = models.CharField(max_length=50)
    character_name = models.CharField(max_length=50)
    actor_image = models.ImageField(upload_to='cast/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            'movie' , 'actor_name' , 'character_name'
        )

    def __str__(self):
        return f"{self.movie} - {self.actor_name}"
    
class Crew(models.Model):

    movie = models.ForeignKey(Movie,on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    role = models.CharField(max_length=50)
    image = models.ImageField(upload_to='crew/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            'movie' , 'name' , 'role'
        )

    def __str__(self):
        return f"{self.movie} - {self.name} - {self.role}"
    
class Show(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
        ('cancelled' , 'Cancelled'),
    )

    movie = models.ForeignKey(Movie,on_delete=models.CASCADE)
    screen = models.ForeignKey(Screen,on_delete=models.CASCADE)
    show_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            'screen', 'show_date', 'start_time'
        )

    def __str__(self):
        return f"{self.movie} - {self.show_date} - {self.start_time}"

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

    booking = models.ForeignKey(Booking,on_delete=models.CASCADE)
    seat = models.ForeignKey(Seat,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            'booking' , 'seat'
        )

    def __str__(self):
        return f"{self.booking} - {self.seat}"

    