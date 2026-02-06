from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .models import Courses
import json

@api_view(['POST'])
def create_course(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            # course = Courses.objects
        except Exception as e:
            pass