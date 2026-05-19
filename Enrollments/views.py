import json

from django.http import JsonResponse

from rest_framework.decorators import (api_view, permission_classes)
from rest_framework.permissions import IsAuthenticated

from UserDetails.models import UserDetails
from Classes.models import StaffAssignments

from .models import StudentEnrollment


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_enrollment(request):

    try:

        data = json.loads(request.body)

        student_id = data.get("student_id")
        class_id = data.get("class_id")
        admin_id = data.get("admin_id")

        student = UserDetails.objects.get(
            id=student_id,
            role="STUDENT"
        )

        assigned_class = StaffAssignments.objects.get(id=class_id)

        admin_user = UserDetails.objects.get(id=admin_id)

        already_enrolled = StudentEnrollment.objects.filter(
            student=student,
            assigned_class=assigned_class
        ).exists()

        if already_enrolled:

            return JsonResponse({
                "status": "Failed",
                "message": "Student already enrolled in this class"
            })

        if assigned_class.available_slot <= 0:

            return JsonResponse({
                "status": "Failed",
                "message": "No slots available"
            })

        StudentEnrollment.objects.create(
            student=student,
            assigned_class=assigned_class,
            enrolled_by=admin_user
        )

        assigned_class.available_slot -= 1

        if assigned_class.available_slot == 0:
            assigned_class.class_status = "FULL"

        assigned_class.save()

        return JsonResponse({
            "status": "Success",
            "message": "Student enrolled successfully"
        })

    except Exception as error:

        return JsonResponse({
            "status": "Failed",
            "message": str(error)
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def load_students(request):

    try:

        students = UserDetails.objects.filter(role="STUDENT").values(
            "id",
            "username"
        )

        return JsonResponse({
            "status": "Success",
            "data": list(students)
        })

    except Exception as error:

        return JsonResponse({
            "status": "Failed",
            "message": str(error)
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def load_available_classes(request):

    try:

        classes = StaffAssignments.objects.filter(
            class_status__in=['OPEN', 'ONGOING'],
            available_slot__gt=0
        )

        data = []

        for item in classes:

            trainer_name = item.staff.username if item.staff else "-"

            data.append({
                "id": item.id,
                "class_name": item.class_name,
                "trainer": trainer_name,
                "timing": item.class_time,
                "start_date": item.class_start_date,
                "available_slot": item.available_slot
            })

        return JsonResponse({
            "status": "Success",
            "data": data
        })

    except Exception as error:

        return JsonResponse({
            "status": "Failed",
            "message": str(error)
        })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def load_enrollments(request):

    try:

        enrollments = StudentEnrollment.objects.select_related(
            "student",
            "assigned_class",
            "assigned_class__staff"
        ).all().order_by("-id")

        data = []

        for item in enrollments:

            data.append({

                "id": item.id,

                "student": item.student.username,

                "class_name": item.assigned_class.class_name,

                "trainer": item.assigned_class.staff.username if item.assigned_class.staff else "-",

                "timing": item.assigned_class.class_time,

                "start_date": item.assigned_class.class_start_date,

                "status": item.enrollment_status

            })

        return JsonResponse({
            "status": "Success",
            "data": data
        })

    except Exception as error:

        return JsonResponse({
            "status": "Failed",
            "message": str(error)
        })