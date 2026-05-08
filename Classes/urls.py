from django.urls import path
from .views import *

urlpatterns = [

    path('add_class/', add_class),
    path('get_all_classes/', get_all_classes),
    path('update_class/', update_class),
    path('delete_class/', delete_class),

]