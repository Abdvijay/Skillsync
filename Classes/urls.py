from django.urls import path
from .views import *

urlpatterns = [

    path('add_assignment/', add_assignment),
    path('get_all_assignments/', get_all_assignments),
    path('update_assignment_timing/',update_assignment_timing),
    path('revoke_assignment/',revoke_assignment),
    path('get_staff_list/',get_staff_list),
    path('update_specialization/',update_specialization),
    path('get_assignment_timings/',get_assignment_timings),
    path('get_all_specializations/',get_all_specializations),
    
]