from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.http import JsonResponse
from .models import Courses
import json
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_course(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            if Courses.objects.filter(course_code=data['course_code']).exists():

                return JsonResponse({
                    "status": "Error",
                    "message": "Course code already exists"
                })
            
            course = Courses.objects.create(
                course_name = data.get('course_name'),
                course_code = data.get('course_code'),
                description = data.get('description'),
                duration = data.get('duration'),
                created_by = data.get('created_by')
            )

            return JsonResponse({
                "status" : "Success",
                "mesage" : "Course Added Successfully",
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
@permission_classes([IsAuthenticated])
def get_all_courses(request):
    try:

        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 5))

        start = (page - 1) * limit
        end = start + limit

        qs = Courses.objects.all()

        total = qs.count()

        data = list(qs.values()[start:end])

        return JsonResponse({
            "status": "Success",
            "total": total,
            "page": page,
            "limit": limit,
            "data": data
        })

    except Exception as e:
        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_course_names(request):

    try:

        courses = Courses.objects.values_list(
            'course_name',
            flat=True
        )

        return JsonResponse({
            "status": "Success",
            "data": list(courses)
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_courses(request):

    try:

        course_name = request.GET.get('course_name')
        duration = request.GET.get('duration')

        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 5))

        start = (page - 1) * limit
        end = start + limit

        qs = Courses.objects.all()

        if course_name:
            qs = qs.filter(course_name__icontains=course_name)

        if duration:
            qs = qs.filter(duration=duration)

        total = qs.count()

        data = list(qs.values()[start:end])

        return JsonResponse({
            "status": "Success",
            "total": total,
            "data": data
        })

    except Exception as e:
        return JsonResponse({
            "status": "Error",
            "message": str(e)
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