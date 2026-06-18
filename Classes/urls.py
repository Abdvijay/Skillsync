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
    path("get_student_tab_batches/", get_student_tab_batches),
    path("get_student_tab_students/", get_student_tab_students),
    path("get_completed_assignments/", get_completed_assignments),
    path("save_student_attendance/", save_student_attendance),
    path("get_attendance_history/",get_attendance_history),
    path("get_attendance_day_details/", get_attendance_day_details),
    path("get_attendance_tab_day_details/", get_attendance_tab_day_details),
    path("get_staff_dashboard_cards/", get_staff_dashboard_cards),
    path("get_staff_dashboard_active_classes/", get_staff_dashboard_active_classes),
    path("ongoing_batch_assignment_management/", ongoing_batch_assignment_management),
    path("get_student_attendance_progress/", get_student_attendance_progress),
    path("get_completed_student_attendance_progress/", get_completed_student_attendance_progress),
]