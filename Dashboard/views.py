from django.http import JsonResponse
from UserDetails.models import UserDetails
from Courses.models import Courses
from Classes.models import StaffAssignments, StudentAttendance
from Notifications.models import Notifications
from Enrollments.models import StudentEnrollment
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import date
from Notifications.helpers import auto_expire_notifications

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_counts(request):

    try:

        total_students = UserDetails.objects.filter(role="STUDENT").count()

        total_staff = UserDetails.objects.filter(role="STAFF").count()

        total_courses = Courses.objects.count()

        active_classes = StaffAssignments.objects.filter(
            class_status__in=["OPEN", "ONGOING"]
        ).count()

        completed_classes = StaffAssignments.objects.filter(
            class_status="COMPLETED"
        ).count()

        total_notifications = Notifications.objects.count()

        return JsonResponse(
            {
                "status": "Success",
                "data": {
                    "students": total_students,
                    "staff": total_staff,
                    "courses": total_courses,
                    "active_classes": active_classes,
                    "completed_classes": completed_classes,
                    "notifications": total_notifications,
                },
            }
        )
    
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recent_classes(request):

    try:

        today = date.today()

        assignments = (
            StaffAssignments.objects.select_related("staff")
            .filter(class_start_date__gt=today, class_status__in=["OPEN", "FULL"])
            .order_by("class_start_date", "class_time")
        )

        data = []

        for item in assignments:

            data.append(
                {
                    "id": item.id,
                    "class_name": item.class_name,
                    "trainer": item.staff.username,
                    "start_date": item.class_start_date,
                    "timing": item.class_time,
                    "available_slot": item.available_slot,
                }
            )

        return JsonResponse({
            "status": "Success", 
            "data": data
        })
    
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_notifications(request):

    try:

        auto_expire_notifications()

        notifications = Notifications.objects.filter(is_active=True).order_by("-created_at")[:8]

        data = []

        for item in notifications:

            data.append(
                {
                    "category": item.category,
                    "content": item.content,
                    "priority": item.priority,
                    "created_at": item.created_at.strftime("%d %b %Y"),
                }
            )

        return JsonResponse({
            "status": "Success", 
            "data": data
        })
    
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def staff_dashboard_recent_classes(request):

    try:

        today = date.today()

        assignments = (
            StaffAssignments.objects.select_related("staff")
            .filter(class_start_date__gt=today, class_status__in=["OPEN", "FULL"])
            .order_by("class_start_date", "class_time")
        )

        data = []

        for item in assignments:

            data.append(
                {
                    "class_name": item.class_name,
                    "trainer": item.staff.username,
                    "start_date": item.class_start_date,
                    "timing": item.class_time,
                    "available_slot": item.available_slot,
                }
            )

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_dashboard_summary(request):

    try:

        username = request.GET.get("username")

        student = UserDetails.objects.get(username=username, role="STUDENT")

        enrolled_classes = (
            StudentEnrollment.objects.filter(student=student)
            .exclude(enrollment_status="COMPLETED")
            .count()
        )

        attendance_records = StudentAttendance.objects.filter(
            student_enrollment__student=student
        )

        total_attendance = attendance_records.count()

        present_attendance = attendance_records.filter(
            attendance_status="PRESENT"
        ).count()

        attendance_percentage = 0

        if total_attendance > 0:

            attendance_percentage = round(
                (present_attendance / total_attendance) * 100, 2
            )

        completed_classes = StudentEnrollment.objects.filter(
            student=student,
            enrollment_status="COMPLETED"
        ).count()

        notifications = Notifications.objects.filter(is_active=True).count()

        return JsonResponse(
            {
                "status": "Success",
                "data": {
                    "enrolled_classes": enrolled_classes,
                    "attendance_percentage": attendance_percentage,
                    "completed_classes": completed_classes,
                    "notifications": notifications,
                },
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_dashboard_active_classes(request):

    try:

        username = request.GET.get("username")

        enrollments = (
            StudentEnrollment.objects.select_related(
                "assigned_class", "assigned_class__staff"
            )
            .filter(student__username=username, enrollment_status="ACTIVE")
            .order_by("-enrolled_date")
        )

        data = []

        for item in enrollments:

            data.append(
                {
                    "class_name": item.assigned_class.class_name,
                    "trainer": item.assigned_class.staff.username,
                    "timing": item.assigned_class.class_time,
                    "start_date": item.assigned_class.class_start_date.strftime(
                        "%d-%m-%Y"
                    ),
                    "status": item.enrollment_status,
                }
            )

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_dashboard_attendance_chart(request):

    try:

        username = request.GET.get("username")

        attendance = StudentAttendance.objects.filter(
            student_enrollment__student__username=username
        )

        present_count = attendance.filter(attendance_status="PRESENT").count()

        absent_count = attendance.filter(attendance_status="ABSENT").count()

        return JsonResponse(
            {"status": "Success", "present": present_count, "absent": absent_count}
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_dashboard_new_classes(request):

    try:

        today = date.today()

        classes = (
            StaffAssignments.objects.select_related("staff")
            .filter(class_start_date__gte=today)
            .exclude(class_status="COMPLETED")
            .order_by("class_start_date")[:5]
        )

        data = []

        for item in classes:

            data.append(
                {
                    "id": item.id,
                    "class_name": item.class_name,
                    "trainer": item.staff.username,
                    "start_date": item.class_start_date.strftime("%Y-%m-%d"),
                    "timing": item.class_time,
                    "available_slot": item.available_slot,
                }
            )

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_dashboard_notifications(request):

    try:

        notifications = Notifications.objects.filter(is_active=True).order_by(
            "-created_at"
        )[:5]

        data = []

        for item in notifications:

            data.append(
                {
                    "category": item.category,
                    "content": item.content,
                    "priority": item.priority,
                    "created_at": item.created_at.strftime("%d %b %Y"),
                }
            )

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})