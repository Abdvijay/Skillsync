from django.urls import path
from .views import *

urlpatterns = [

    path('add_class/', add_class),
    path('get_all_classes/', get_all_classes),
    path('update_class/', update_class),
    path('delete_class/', delete_class),
    path('assign_staff/', assign_staff),
    path('update_staff_timing/',update_staff_timing),
    path('add_assignment/', add_assignment),
    path('get_all_assignments/', get_all_assignments),
    path('update_assignment_timing/',update_assignment_timing),
    path('revoke_assignment/',revoke_assignment),
    path('get_staff_list/',get_staff_list),
    path('update_specialization/',update_specialization),
    path('get_assignment_timings/',get_assignment_timings),
]