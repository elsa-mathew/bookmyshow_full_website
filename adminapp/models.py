from django.db import models

class Category(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
    )

    name = models.CharField(max_length=50,unique=True)
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name 

class Subcatagories(models.Model):

    status_choice = (
        ('active' , 'Active'),
        ('inactive' , 'Inactive'),
    )

    category =  models.ForeignKey(Category,on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    status = models.CharField(max_length=20,choices=status_choice,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            'category' , 'name'
        )

    def __str__(self):
        return f"{self.category.name} - {self.name}"


