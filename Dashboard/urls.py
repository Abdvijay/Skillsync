from django.urls import path
from . import views

urlpatterns = [
    path("dashboard_counts/",views.dashboard_counts),
    path("recent_classes/",views.recent_classes),
    path("dashboard_notifications/",views.dashboard_notifications),
    path("staff_recent_classes/", views.staff_dashboard_recent_classes),
    path("student/student_dashboard_summary/", views.student_dashboard_summary),
    path("student/student_dashboard_active_classes/", views.student_dashboard_active_classes),
    path("student/student_dashboard_attendance_chart/", views.student_dashboard_attendance_chart),
    path("student/student_dashboard_new_classes/", views.student_dashboard_new_classes),
    path("student/student_dashboard_notifications/", views.student_dashboard_notifications),
]