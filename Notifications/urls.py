from django.urls import path

from .views import *

urlpatterns = [
    path("add_notification/", add_notification),
    path("get_notifications/", get_notifications),
    path("update_notification/", update_notification),
    path("delete_notification/", delete_notification),
]