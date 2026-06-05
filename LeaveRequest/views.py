import json

from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import IsAuthenticated

from UserDetails.models import UserDetails

from .models import StaffLeaveRequest

from datetime import datetime

from django.utils import timezone

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_leave_request(request):

    try:

        data = json.loads(request.body)

        leave_type = data.get("leave_type")

        start_date = data.get("start_date")

        end_date = data.get("end_date")

        current_staff = UserDetails.objects.get(username=request.user.username)

        # VALIDATION

        if not leave_type:

            return JsonResponse(
                {"status": "Error", "message": "Please select leave type"}
            )

        if not start_date:

            return JsonResponse(
                {"status": "Error", "message": "Please select start date"}
            )

        if not end_date:

            return JsonResponse(
                {"status": "Error", "message": "Please select end date"}
            )

        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()

        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()

        # INVALID DATE

        if end_date_obj < start_date_obj:

            return JsonResponse(
                {
                    "status": "Error",
                    "message": ("End date " "cannot be " "before " "start date"),
                }
            )

        # TOTAL DAYS

        total_days = ((end_date_obj - start_date_obj).days) + 1

        # CHECK OVERLAPPING LEAVE

        already_applied = (
            StaffLeaveRequest.objects.filter(
                staff=current_staff, status__in=["PENDING", "APPROVED"]
            )
            .filter(start_date__lte=end_date_obj, end_date__gte=start_date_obj)
            .exists()
        )

        if already_applied:

            return JsonResponse(
                {
                    "status": "Error",
                    "message": ("Leave already applied for selected dates"),
                }
            )


        StaffLeaveRequest.objects.create(
            staff=current_staff,
            leave_type=leave_type,
            start_date=start_date_obj,
            end_date=end_date_obj,
            total_days=total_days,
        )

        return JsonResponse(
            {
                "status": "Success",
                "message": ("Leave request " "submitted " "successfully"),
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_staff_leave_requests(request):

    try:

        username = request.GET.get("username")

        today = timezone.now().date()

        leave_requests = StaffLeaveRequest.objects.filter(
            staff__username=username
        ).order_by("-requested_at")

        upcoming_requests = []

        leave_history = []

        for item in leave_requests:

            row = {
                "id": item.id,
                "applied_date": item.requested_at.strftime("%d-%m-%Y"),
                "leave_type": item.leave_type,
                "start_date": item.start_date.strftime("%d-%m-%Y"),
                "end_date": item.end_date.strftime("%d-%m-%Y"),
                "total_days": item.total_days,
                "status": item.status,
                "approved_by": (item.reviewed_by.username if item.reviewed_by else "-"),
            }

            # HISTORY

            if item.status == "REJECTED" or item.end_date < today:

                leave_history.append(row)

            # UPCOMING

            else:

                upcoming_requests.append(row)

        return JsonResponse(
            {
                "status": "Success",
                "upcoming_requests": upcoming_requests,
                "leave_history": leave_history,
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})