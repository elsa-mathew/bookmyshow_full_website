from django.urls import path
from . import views

urlpatterns = [
    path('theatre_dashboard/', views.dashboard),
]