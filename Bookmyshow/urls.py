from django.urls import path, include

urlpatterns = [
    path('api/adminapp/', include('adminapp.urls')),
    path('', include('authenticate.urls')),
    path('api/theatre/', include('theatre.urls')),
    path('api/user/', include('user.urls')),
]
