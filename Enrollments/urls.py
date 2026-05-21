from django.urls import path
from . import views

urlpatterns = [

    path("create_enrollment/",views.create_enrollment),
    path("load_students/", views.load_students),
    path("load_available_classes/", views.load_available_classes),
    path("get_all_enrollments/", views.get_all_enrollments),
    path("get_student_by_unique_id/", views.get_student_by_unique_id),
    path( "update_enrollment/", views.update_enrollment),
    path("delete_enrollment/<int:enrollment_id>/",views.delete_enrollment),
    path("get_enrollment_timings/", views.get_enrollment_timings),
]