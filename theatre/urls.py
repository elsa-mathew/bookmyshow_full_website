from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard),
    path('api/theatres/add/',views.add_theatre,name='add_theatre'),
    path('api/theatres/',views.get_theatres,name='get_theatres'),
    path('api/theatres/update/<int:id>/',views.update_theatre,name='update_theatre'),
    path('api/theatres/delete/<int:id>/',views.delete_theatre,name='delete_theatre'),
]