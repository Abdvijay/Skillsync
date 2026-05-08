from django.urls import path
from .views import *

urlpatterns = [
    path('add_course/', add_course),
    path('get_all_courses/', get_all_courses),
    path('get_course/', get_course),
    path('search_courses/', search_courses),
    path('update_course/', update_course),
    # path('delete_course/<int:course_id>/', delete_course), # Another way to get id 
    path('delete_course/', delete_course),
]