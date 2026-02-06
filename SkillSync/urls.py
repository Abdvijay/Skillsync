"""
URL configuration for SkillSync project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from UserDetails import views as user_details # From Userdetails app use views page as user_details name

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/',user_details.user_register,name="register"),
    path('get_particular_user/',user_details.get_particular_user,name="get_particular_user"),
    path('get_all_users/',user_details.get_all_users,name="get_all_users"),
    path('update_user/',user_details.update_user,name="update_user"),
    path('delete_user/',user_details.delete_user,name="delete_user"),
    path('login/',user_details.login_user,name="login_user"),
    path('search_user/',user_details.search_user,name="search_user"),
    path('course/', include('Courses.urls')),
]
