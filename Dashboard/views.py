from django.http import JsonResponse
from UserDetails.models import UserDetails
from Courses.models import Courses
from Classes.models import StaffAssignments
from Notifications.models import Notifications
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

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

        assignments = (StaffAssignments.objects.select_related("staff").filter(
            class_status__in=["OPEN", "ONGOING"],
            available_slot__gt=0).order_by("-assigned_date"))

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

        notifications = Notifications.objects.order_by("-created_at")[:8]

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

        assignments = (
            StaffAssignments.objects.select_related("staff")
            .filter(class_status__in=["OPEN", "ONGOING"], available_slot__gt=0)
            .order_by("-assigned_date")
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