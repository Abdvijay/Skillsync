from django.urls import path
from .views import *

urlpatterns = [
    path('create_course/', create_course),
    path('get_all_courses/', get_all_courses),
    path('get_course/', get_course),
    path('search_course/', search_course),
    path('update_course/', update_course),
    # path('delete_course/<int:course_id>/', delete_course), # Another way to get id 
    path('delete_course/', delete_course),
]