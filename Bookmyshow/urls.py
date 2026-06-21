from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('api/adminapp/', include('adminapp.urls')),
    path('', include('authenticate.urls')),
    path('api/theatre/', include('theatre.urls')),
    path('api/user/', include('user.urls')),
    path('api/booking/', include('booking.urls')),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
