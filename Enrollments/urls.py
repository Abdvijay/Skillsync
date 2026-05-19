from django.urls import path
from . import views

urlpatterns = [

    path("create_enrollment/",views.create_enrollment),
    path("load_students/", views.load_students),
    path("load_available_classes/", views.load_available_classes),
    path("load_enrollments/", views.load_enrollments),

]