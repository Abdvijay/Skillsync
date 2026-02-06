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
            course = Courses.objects.create(
                course_name = data.get('course_name'),
                course_code = data.get('course_code'),
                description = data.get('description'),
                duration = data.get('duration'),
                created_by = data.get('created_by')
            )

            return JsonResponse({
                "status" : "Success",
                "mesage" : "Course Created Successfully",
                "data" : {
                    "id" : course.id,
                    "course_name" : course.course_name,
                    "course_code" : course.course_code
                }
            })
        except Exception as e:
            return JsonResponse({
                "status" : "Error",
                "mesage" : str(e),
            },status = 500)

@api_view(['GET'])
def get_all_courses(request):
    courses = Courses.objects.all()

    data = []
    for c in courses:
        data.append({
            "id": c.id,
            "course_name": c.course_name,
            "course_code": c.course_code,
            "duration": c.duration,
        })

    return JsonResponse({
        "status": "Success",
        "count" : len(data),
        "data": data
    })

@api_view(['GET'])
def get_course(request):
    try:
        course_id = json.loads(request.body).get('id')
        course = Courses.objects.get(id=course_id)

        return JsonResponse({
            "status": "Success",
            "data": {
                "id": course.id,
                "course_name": course.course_name,
                "course_code": course.course_code,
                "description": course.description,
                "duration": course.duration,
            }
        })

    except Courses.DoesNotExist:
        return JsonResponse(
            {"status": "Error", "message": "Course not found"},
            status=404
        )

@api_view(['GET'])
def search_course(request):
    # /course/search/?q=python

    query = request.GET.get('q')

    qs = Courses.objects.all()

    if query:
        qs = qs.filter(course_name__icontains=query)

    data = []
    for c in qs:
        data.append({
            "id": c.id,
            "course_name": c.course_name,
            "course_code": c.course_code,
        })

    return JsonResponse({
        "status": "Success",
        "data": data
    })

@api_view(['PUT', 'PATCH'])
def update_course(request):
    try:
        data = json.loads(request.body)
        course_id = data.get('id')

        if not course_id:
            return JsonResponse(
                {"status": "Error", "message": "id is required"},
                status=400
            )

        course = Courses.objects.get(id=course_id)

        if 'course_name' in data:
            course.course_name = data['course_name']
        if 'course_code' in data:
            course.course_code = data['course_code']
        if 'description' in data:
            course.description = data['description']
        if 'duration' in data:
            course.duration = data['duration']
        if 'updated_by' in data:
            course.updated_by = data['updated_by']

        course.save()

        return JsonResponse({
            "status": "Success",
            "message": "Course updated successfully"
        })

    except Courses.DoesNotExist:
        return JsonResponse(
            {"status": "Error", "message": "Course not found"},
            status=404
        )
    except Exception as e:
        return JsonResponse(
            {"status": "Error", "message": str(e)},
            status=500
        )

@api_view(['DELETE'])
def delete_course(request):
    try:
        data = json.loads(request.body)
        course_id = data.get('id')
        course = Courses.objects.get(id=course_id)
        course.delete()

        return JsonResponse({
            "status": "Success",
            "message": "Course deleted successfully"
        })

    except Courses.DoesNotExist:
        return JsonResponse(
            {"status": "Error", "message": "Course not found"},
            status=404
        )
