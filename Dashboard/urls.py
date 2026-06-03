from django.urls import path
from . import views

urlpatterns = [
    path("dashboard_counts/",views.dashboard_counts),
    path("recent_classes/",views.recent_classes),
    path("dashboard_notifications/",views.dashboard_notifications),
    path("staff_recent_classes/", views.staff_dashboard_recent_classes),
]