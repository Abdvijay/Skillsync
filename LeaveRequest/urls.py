from django.urls import path

from . import views

urlpatterns = [
    path("send_leave_request/", views.send_leave_request),
    path("get_staff_leave_requests/", views.get_staff_leave_requests),
    path("get_admin_leave_requests/", views.get_admin_leave_requests),
    path("update_leave_request_status/", views.update_leave_request_status),
    path("student/send_student_leave_request/", views.send_student_leave_request),
    path("student/get_student_leave_requests/", views.get_student_leave_requests),
    path("student/get_student_leave_requests_for_staff/", views.get_student_leave_requests_for_staff),
    path("student/update_student_leave_status/", views.update_student_leave_status),
    path("staff/update_student_leave_request_status/", views.update_student_leave_request_status),
]