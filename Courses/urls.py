from django.urls import path
from .views import *

urlpatterns = [
    path('create/', create_course),
    # path('all/', get_all_courses),
    # path('<int:course_id>/', get_course),
    # path('search/', search_course),
    # path('update/', update_course),
    # path('delete/<int:course_id>/', delete_course),
]