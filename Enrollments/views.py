import json

from django.http import JsonResponse

from rest_framework.decorators import (api_view, permission_classes)
from rest_framework.permissions import IsAuthenticated

from UserDetails.models import UserDetails
from Classes.models import StaffAssignments

from .models import StudentEnrollment
from django.db.models import Q


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_enrollment(request):

    try:

        data = json.loads(request.body)

        student_id = data.get("student_id")

        class_id = data.get("class_id")

        admin_user = UserDetails.objects.get(username=request.user.username)

        student = (UserDetails.objects.get(id=student_id,role="STUDENT"))

        assigned_class = (StaffAssignments.objects.get(id=class_id))

        #DUPLICATE CHECK

        already_enrolled = (StudentEnrollment.objects.filter(
                student=student,
                assigned_class__class_name__iexact = assigned_class.class_name
            ).exists()
        )

        if already_enrolled:
            return JsonResponse({
                "status": "Failed",
                "message": (f"{student.username} already enrolled in {assigned_class.class_name} class and Student cannot join same class again...!!")
            })

        #SLOT CHECK
    
        if ( assigned_class.available_slot <= 0 ):

            return JsonResponse({
                "status": "Failed",
                "message": "No slots available",
            });
    
        # PURCHASED COURSE CHECK

        purchased_course = (student.purchased_course)

        if not purchased_course:
            return JsonResponse({
                "status": "Failed",
                "message": "Student has no purchased course",
            });

        related_classes = [
            item.strip().lower()
            for item in purchased_course.related_classes.split(",")
            if item.strip()
        ]

        current_class_name = (assigned_class.class_name.strip().lower())

        if ( current_class_name not in related_classes ):
            return JsonResponse({
                "status": "Failed",
                "message": f"{student.username} cannot enroll in {assigned_class.class_name}. Class not included in purchased course of {purchased_course.course_name}"
            })

        same_timing_exists = (
        StudentEnrollment.objects.filter(
                student=student,
                assigned_class__class_time=
                assigned_class.class_time,
                enrollment_status="ACTIVE"
            ).exists()
        )

        if same_timing_exists:

            return JsonResponse({
                "status": "Failed",
                "message": (f"{student.username} already enrolled in {assigned_class.class_time} batch. Student cannot join same timing until current class completed")
            })
        
        # CREATE ENROLLMENT

        StudentEnrollment.objects.create(student=student,assigned_class=assigned_class,enrolled_by=admin_user)

        # REDUCE SLOT

        assigned_class.available_slot -= 1

        if ( assigned_class.available_slot == 0 ):
            assigned_class.class_status = ("FULL")

        assigned_class.save()

        return JsonResponse({
            "status": "Success",
            "message":"Student enrolled successfully",
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

        students = UserDetails.objects.filter(role="STUDENT").values("id","username")

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
                "available_slot": item.available_slot,
                "student_limit": item.student_limit
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
def get_all_enrollments(request):

    try:

        search = request.GET.get("search","")

        timing = request.GET.get("timing","")

        page = int(request.GET.get("page",1))

        limit = int(request.GET.get("limit",10))

        enrollments = (StudentEnrollment.objects
            .select_related(
                "student",
                "assigned_class",
                "assigned_class__staff"
            )
            .order_by(
                "-enrolled_date"
            )
        )

        # SEARCH

        if search:

            enrollments = (enrollments.filter(
                    Q(student__username__icontains=search) |
                    Q(assigned_class__class_name__icontains=search) |
                    Q(assigned_class__staff__username__icontains=search)
                )
            )

        if timing:

            enrollments = (enrollments.filter(assigned_class__class_time=timing))

        total = (enrollments.count())

        start = ((page - 1) * limit)

        end = (start + limit)

        enrollments = (enrollments[start:end])

        data = []

        for item in enrollments:

            data.append({

                "id": item.id,

                "student_unique_id": item.student.student_unique_id,

                "student_name": item.student.username,

                "class_name": item.assigned_class.class_name,

                "trainer": item.assigned_class.staff.username,

                "timing": item.assigned_class.class_time,

                "start_date": item.assigned_class.class_start_date,

                "status": item.enrollment_status
            })

        return JsonResponse({
            "status": "Success",
            "data": data,
            "total": total
        })

    except Exception as error:
        return JsonResponse({
            "status": "Failed",
            "message": str(error)
        })
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_by_unique_id(request):

    try:

        student_unique_id = request.GET.get("student_unique_id")

        if not student_unique_id:

            return JsonResponse({
                "status": "Failed",
                "message": "Student unique ID required"
            })

        student = UserDetails.objects.get(
            student_unique_id=student_unique_id,
            role="STUDENT"
        )

        return JsonResponse({
            "status": "Success",
            "data": {

                "student_id": student.id,

                "student_name": student.username,

                "purchased_course": student.purchased_course.course_name if student.purchased_course else "",

                "purchased_course_id": student.purchased_course.id if student.purchased_course else ""
            }
        })

    except UserDetails.DoesNotExist:

        return JsonResponse({
            "status": "Failed",
            "message": "Student not found"
        })

    except Exception as error:

        return JsonResponse({
            "status": "Failed",
            "message": str(error)
        })
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_enrollment(request, enrollment_id):

    try:

        enrollment = (StudentEnrollment.objects.get(id=enrollment_id))

        assigned_class = (enrollment.assigned_class)

        # DELETE ENROLLMENT

        enrollment.delete()

        # INCREASE SLOT

        assigned_class.available_slot += 1

        # CHANGE STATUS

        if (assigned_class.class_status == "FULL"):

            assigned_class.class_status = ("OPEN")

        assigned_class.save()

        return JsonResponse({
            "status": "Success",
            "message": ("Enrollment deleted successfully")
        })

    except StudentEnrollment.DoesNotExist:

        return JsonResponse({
            "status": "Failed",
            "message": ("Enrollment not found")
        })

    except Exception as error:

        return JsonResponse({
            "status": "Failed",
            "message": str(error)
        })
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_enrollment(request):

    try:

        data = json.loads(request.body)

        enrollment_id = data.get("enrollment_id")

        enrollment_status = data.get("enrollment_status")

        enrollment = (StudentEnrollment.objects.get(id=enrollment_id))

        enrollment.enrollment_status = (enrollment_status)

        enrollment.save()

        return JsonResponse({
            "status": "Success",
            "message": ("Enrollment updated successfully")
        })

    except StudentEnrollment.DoesNotExist:

        return JsonResponse({
            "status": "Failed",
            "message": ("Enrollment not found")
        })

    except Exception as error:

        return JsonResponse({
            "status": "Failed",
            "message": str(error)
        })
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_enrollment_timings(request):

    try:

        timings = StudentEnrollment.objects.select_related("assigned_class").values_list(
            "assigned_class__class_time", flat=True
        ).distinct()

        return JsonResponse({
            "status": "Success", 
            "data": list(timings)
        })

    except Exception as error:

        return JsonResponse({
            "status": "Failed",
            "message": str(error)
        })