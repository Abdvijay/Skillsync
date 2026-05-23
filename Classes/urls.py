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
    path('get_staff_batches/',get_staff_batches),
    path('get_staff_batch_classes/',get_staff_batch_classes),
    path('get_staff_completed_batches/', get_staff_completed_batches),
    path("get_ongoing_batch_students/", get_ongoing_batch_students),
    path("update_student_enrollment_status/", update_student_enrollment_status),
    path("get_completed_batch_students/", get_completed_batch_students),
]