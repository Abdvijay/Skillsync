from django.urls import path
from .views import *

urlpatterns = [
    path('register/',user_register,name="register"),
    path('get_particular_user/',get_particular_user,name="get_particular_user"),
    path('get_all_users/',get_all_users,name="get_all_users"),
    path('update_user/',update_user,name="update_user"),
    path('delete_user/',delete_user,name="delete_user"),
    path('login/',login_user,name="login_user"),
    path('search_user/',search_user,name="search_user"),
    path('reset_password/',reset_password,name="reset_password"),
    path('check_email/', check_email, name="check_email"),
]