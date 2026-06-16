from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard,name='dashboard'),
    path('categories/',views.category_list,name='category_list'),
    path('api/categories/',views.get_categories,name='get_categories'),
    path('api/categories/add/',views.add_category,name='add_category'),
    path('api/categories/update/<int:id>/',views.update_category,name='update_category'),
    path('api/categories/delete/<int:id>/',views.delete_category,name='delete_category'),
    path('api/subcategories/<int:category_id>/',views.get_subcategories,name='get_subcategories'),
    path('api/subcategories/add/',views.add_subcategory,name='add_subcategory'),
    path('api/subcategories/update/<int:id>/',views.update_subcategory,name='update_subcategory'),
    path('theatres/',views.theatre_list,name='theatre_list'),
    path('logout/',views.logout_view,name='logout'),
]