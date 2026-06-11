from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):

    role_choice=(
        ('user','User'),
        ('theatre','Theatre'),
        ('admin','Admin')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username