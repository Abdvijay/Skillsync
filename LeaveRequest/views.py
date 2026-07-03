import json

from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import IsAuthenticated

from UserDetails.models import UserDetails

from .models import StaffLeaveRequest, StudentLeaveRequest

from datetime import datetime

from django.utils import timezone

from django.db.models import Q

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

        # AUTO DELETE EXPIRED PENDING

        StaffLeaveRequest.objects.filter(status="PENDING", end_date__lt=today).delete()

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

            # UPCOMING TABLE

            if item.status in ["PENDING", "APPROVED"] and item.end_date >= today:

                upcoming_requests.append(row)

            # HISTORY TABLE

            elif item.status in ["APPROVED", "REJECTED"]:

                leave_history.append(row)

        return JsonResponse(
            {
                "status": "Success",
                "upcoming_requests": upcoming_requests,
                "leave_history": leave_history,
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_admin_leave_requests(request):

    try:

        today = timezone.now().date()

        # AUTO DELETE EXPIRED PENDING

        StaffLeaveRequest.objects.filter(status="PENDING", end_date__lt=today).delete()

        leave_requests = StaffLeaveRequest.objects.select_related(
            "staff", "reviewed_by"
        ).order_by("-requested_at")

        pending_requests = []

        leave_history = []

        for item in leave_requests:

            row = {
                "id": item.id,
                "staff": item.staff.username,
                "leave_type": item.leave_type,
                "start_date": item.start_date.strftime("%d-%m-%Y"),
                "end_date": item.end_date.strftime("%d-%m-%Y"),
                "total_days": item.total_days,
                "applied_date": item.requested_at.strftime("%d-%m-%Y"),
                "status": item.status,
                "handled_by": (item.reviewed_by.username if item.reviewed_by else "-"),
            }

            # PENDING TABLE

            if item.status == "PENDING":

                pending_requests.append(row)

            # HISTORY TABLE

            elif item.status in ["APPROVED", "REJECTED"]:

                leave_history.append(row)

        return JsonResponse(
            {
                "status": "Success",
                "pending_requests": pending_requests,
                "leave_history": leave_history,
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_leave_request_status(request):

    try:

        data = json.loads(request.body)

        request_id = data.get("id")

        status = data.get("status")

        leave_request = StaffLeaveRequest.objects.get(id=request_id)

        admin_user = UserDetails.objects.get(username=request.user.username)

        leave_request.status = status

        leave_request.reviewed_by = admin_user

        leave_request.reviewed_at = timezone.now()

        leave_request.save()

        return JsonResponse(
            {"status": "Success", "message": f"Leave {status.lower()} successfully"}
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_student_leave_request(request):

    try:

        username = request.data.get("username")

        leave_type = request.data.get("leave_type")

        start_date = request.data.get("start_date")

        end_date = request.data.get("end_date")

        student = UserDetails.objects.get(username=username)

        start = datetime.strptime(start_date, "%Y-%m-%d").date()

        end = datetime.strptime(end_date, "%Y-%m-%d").date()

        total_days = (end - start).days + 1

        StudentLeaveRequest.objects.create(
            student=student,
            leave_type=leave_type,
            start_date=start,
            end_date=end,
            total_days=total_days,
        )

        return JsonResponse(
            {"status": "Success", "message": "Leave Request Submitted Successfully"}
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_student_leave_requests(request):

    try:

        username = request.GET.get("username")

        page = int(request.GET.get("page", 1))

        limit = int(request.GET.get("limit", 5))

        search = request.GET.get("search", "")

        leave_type = request.GET.get("leave_type", "")

        status = request.GET.get("status", "")

        start = (page - 1) * limit

        end = start + limit

        leave_requests = (
            StudentLeaveRequest.objects.select_related("student", "reviewed_by")
            .filter(student__username=username)
            .order_by("-requested_at")
        )

        # SEARCH

        if search:

            leave_requests = leave_requests.filter(
                Q(start_date__icontains=search) | Q(leave_type__icontains=search)
            )

        # LEAVE TYPE FILTER

        if leave_type:

            leave_requests = leave_requests.filter(leave_type=leave_type)

        # STATUS FILTER

        if status == "PENDING":

            leave_requests = leave_requests.filter(status="PENDING")

        elif status == "COMPLETED":

            leave_requests = leave_requests.filter(status__in=["APPROVED", "REJECTED"])

        total = leave_requests.count()

        data = []

        for item in leave_requests[start:end]:

            data.append(
                {
                    "id": item.id,
                    "leave_type": item.leave_type,
                    "start_date": item.start_date.strftime("%d-%m-%Y"),
                    "end_date": item.end_date.strftime("%d-%m-%Y"),
                    "total_days": item.total_days,
                    "status": item.status,
                    "requested_at": item.requested_at.strftime("%d-%m-%Y"),
                    "staff_remarks": item.staff_remarks or "-",
                    "reviewed_by": (
                        item.reviewed_by.username if item.reviewed_by else "-"
                    ),
                }
            )

        return JsonResponse(
            {
                "status": "Success",
                "total": total,
                "page": page,
                "limit": limit,
                "data": data,
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)}) 


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_student_leave_requests_for_staff(request):

    try:

        page = int(request.GET.get("page", 1))

        limit = int(request.GET.get("limit", 5))

        search = request.GET.get("search", "")

        status = request.GET.get("status", "")

        start = (page - 1) * limit

        end = start + limit

        leave_requests = StudentLeaveRequest.objects.select_related("student").filter(status="PENDING").order_by("-requested_at")

        if search:

            leave_requests = leave_requests.filter(
                Q(student__username__icontains=search) | Q(leave_type__icontains=search)
            )

        if status:

            leave_requests = leave_requests.filter(status=status)

        total = leave_requests.count()

        data = []

        for item in leave_requests[start:end]:

            data.append(
                {
                    "id": item.id,
                    "student": item.student.username,
                    "leave_type": item.leave_type,
                    "start_date": item.start_date.strftime("%d-%m-%Y"),
                    "end_date": item.end_date.strftime("%d-%m-%Y"),
                    "total_days": item.total_days,
                    "status": item.status,
                    "requested_at": item.requested_at.strftime("%d-%m-%Y"),
                }
            )

        return JsonResponse(
            {
                "status": "Success",
                "total": total,
                "page": page,
                "limit": limit,
                "data": data,
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_student_leave_status(request):

    try:

        leave_id = request.data.get("leave_id")

        status = request.data.get("status")

        remarks = request.data.get("staff_remarks")

        username = request.data.get("username")

        leave = StudentLeaveRequest.objects.get(id=leave_id)

        reviewer = UserDetails.objects.get(username=username)

        leave.status = status

        leave.staff_remarks = remarks

        leave.reviewed_by = reviewer

        leave.reviewed_at = timezone.now()

        leave.save()

        return JsonResponse(
            {"status": "Success", "message": "Leave Request Updated Successfully"}
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_student_leave_request_status(request):

    try:

        data = json.loads(request.body)

        request_id = data.get("id")

        status = data.get("status")

        leave_request = StudentLeaveRequest.objects.get(id=request_id)

        staff_user = UserDetails.objects.get(username=request.user.username)

        leave_request.status = status

        leave_request.reviewed_by = staff_user

        leave_request.reviewed_at = timezone.now()

        leave_request.save()

        return JsonResponse(
            {
                "status": "Success",
                "message": f"Student Leave {status.lower()} successfully",
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})