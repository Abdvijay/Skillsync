import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Classes, StaffAssignments
from datetime import date, datetime
from django.db.models import Q
from UserDetails.models import UserDetails
from Enrollments.models import StudentEnrollment
from django.utils import timezone
from .models import StudentAttendance

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def assign_staff(request):

    try:

        data = json.loads(request.body)

        obj = UserDetails.objects.get(id=data['id'])

        obj.availability = "NOT AVAILABLE"

        obj.assigned_date = date.today()

        obj.class_time = data['class_time']

        if obj.class_time == "":
            return JsonResponse({
            "status": "Error",
            "message": "Please Choose Atleast One Timing",
            "data" : data
        })

        obj.save()

        return JsonResponse({
            "status": "Success",
            "message": "Staff assigned successfully",
            "data" : data
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_assignment(request):

    try:

        data = json.loads(request.body)

        staff_id = data['staff_id']

        class_name = data['class_name']

        class_time = data['class_time']

        class_start_date = data['class_start_date']

        student_limit = data['student_limit']

        class_status = "OPEN"

        if class_name == "":
             return JsonResponse({
                "status": "Error",
                "message": "Cannot assign without selecting class name...!!!"
            })

        if class_time == "":
             return JsonResponse({
                "status": "Error",
                "message": "Cannot assign without selecting timing...!!!"
            })
        
        if class_start_date == "":
            return JsonResponse({
                "status": "Error",
                "message": "Cannot assign without selecting class start date...!!!"
            })

        if student_limit == "":
            return JsonResponse({
                "status": "Error",
                "message": "Cannot assign without student limit...!!!"
            })
        
        if int(student_limit) <= 0:
            return JsonResponse({
                "status": "Error",
                "message": "Student limit must be greater than 0"
            })

        # ✅ Prevent same timing duplicate
        already_exists = StaffAssignments.objects.filter(
            staff_id=staff_id,
            class_time=class_time,
            class_start_date=class_start_date,
        ).exists()

        if already_exists:

            return JsonResponse({
                "status": "Error",
                "message": "Staff already assigned at this timing"
            })

        StaffAssignments.objects.create(

            staff_id=staff_id,

            class_name=class_name,

            class_time=class_time,

            class_start_date=class_start_date,

            student_limit=student_limit,

            class_status=class_status,

            assigned_by=request.user.username,

            available_slot=student_limit,
        )

        return JsonResponse({
            "status": "Success",
            "message": "Assignment created successfully",
            "data" : data
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_assignments(request):

    try:

        today = date.today()

        StaffAssignments.objects.filter(
            class_start_date=today,
            class_status="OPEN"
        ).update(
            class_status="ONGOING"
        )

        page = int(request.GET.get('page', 1))

        limit = int(request.GET.get('limit', 5))

        search = request.GET.get('search')

        time_filter = request.GET.get('class_time')

        status_filter = request.GET.get('class_status')

        start = (page - 1) * limit

        end = start + limit

        qs = StaffAssignments.objects.select_related('staff').exclude(class_status="COMPLETED").order_by('class_start_date','class_time')

        if search:

            qs = qs.filter(
                Q(staff__username__icontains=search) |
                Q(class_name__icontains=search)
            )

        if time_filter:

             qs = qs.filter(class_time=time_filter)

        if status_filter:

            qs = qs.filter(class_status=status_filter)

        total = qs.count()

        data = []

        for item in qs[start:end]:

            data.append({

                "id": item.id,

                "staff_name": item.staff.username,

                "class_name": item.class_name,

                "class_time": item.class_time,

                "assigned_date": item.assigned_date,

                "class_start_date": item.class_start_date,

                "student_limit": item.student_limit,

                "class_status": item.class_status
            })

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
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_assignment_timing(request):

    try:

        data = json.loads(request.body)

        obj = StaffAssignments.objects.get(id=data['id'])

        # ✅ Prevent duplicate timing
        already_exists = StaffAssignments.objects.filter(
            staff=obj.staff,
            class_time=data['class_time'],
        ).exclude(id=obj.id).exists()

        if already_exists:

            return JsonResponse({
                "status": "Error",
                "message": "Timing already assigned"
            })

        obj.class_time = data['class_time']

        obj.class_start_date = data['class_start_date']

        obj.student_limit = data['student_limit']

        old_status = obj.class_status

        obj.class_status = data['class_status']

        # COMPLETED → SET END DATE

        if (data['class_status'] == "COMPLETED" and old_status != "COMPLETED"):

            obj.class_end_date = timezone.now().date()

        # REOPEN → REMOVE END DATE

        elif (old_status == "COMPLETED" and data['class_status'] in ["OPEN", "ONGOING", "FULL"]):

            obj.class_end_date = None

        if obj.class_time == "":
             return JsonResponse({
                "status": "Error",
                "message": "Cannot assign without selecting timing...!!!"
            })
        
        if obj.class_start_date == "":
             return JsonResponse({
                "status": "Error",
                "message": "Cannot assign without selecting class_start_date...!!!"
            })
        
        if obj.student_limit == "":
             return JsonResponse({
                "status": "Error",
                "message": "Cannot assign without selecting student_limit...!!!"
            })
        
        if obj.class_status == "":
             return JsonResponse({
                "status": "Error",
                "message": "Cannot assign without selecting class_status...!!!"
            })
        
        if data["class_status"] == "COMPLETED":

            StudentEnrollment.objects.filter(
                assigned_class=obj, enrollment_status="ACTIVE"
            ).update(enrollment_status="COMPLETED")

        elif data["class_status"] in ["OPEN", "ONGOING", "FULL"]:

            StudentEnrollment.objects.filter(
                assigned_class=obj, enrollment_status="COMPLETED"
            ).update(enrollment_status="ACTIVE")

        obj.save()

        return JsonResponse({
            "status": "Success",
            "message": "updated successfully",
            "data" : data
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def revoke_assignment(request):

    try:

        data = json.loads(request.body)

        obj = StaffAssignments.objects.get(
            id=data['id']
        )

        obj.delete()

        return JsonResponse({
            "status": "Success",
            "message": "Assignment removed successfully"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_staff_list(request):

    try:

        page = int(request.GET.get('page', 1))

        limit = int(request.GET.get('limit', 5))

        search = request.GET.get('search')

        start = (page - 1) * limit

        end = start + limit

        qs = UserDetails.objects.filter(
            role="STAFF"
        )

        if search:

            qs = qs.filter(
                Q(username__icontains=search) |
                Q(class_name__icontains=search)
            )

        total = qs.count()

        data = list(
            qs.values()[
                start:end
            ]
        )

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
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_specialization(request):

    try:

        data = json.loads(request.body)

        obj = UserDetails.objects.get(
            id=data['id']
        )

        obj.class_name = data[
            'class_name'
        ]

        obj.save()

        return JsonResponse({
            "status": "Success",
            "message": "Specialization updated successfully"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assignment_timings(request):

    try:

        timings = StaffAssignments.objects.exclude(class_status = "COMPLETED").values_list('class_time',flat=True).distinct()
        timings = sorted(timings, key=lambda x: datetime.strptime(x.split(" - ")[0],"%I %p"))

        return JsonResponse({
            "status": "Success",
            "data": list(timings)
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_specializations(request):

    try:

        users = UserDetails.objects.filter(
            role="STAFF"
        )

        specializations = set()

        for user in users:

            if user.class_name:

                for item in user.class_name.split(","):

                    specializations.add(
                        item.strip()
                    )

        return JsonResponse({
            "status": "Success",
            "data": sorted(
                list(specializations)
            )
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_staff_batches(request):

    try:
        username = request.GET.get('username')
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 5))
        search = request.GET.get('search')
        class_name = request.GET.get('class_name')
        status_filter = request.GET.get('class_status')

        start = (page - 1) * limit
        end = start + limit

        qs = StaffAssignments.objects.filter(staff__username=username).exclude(class_status="COMPLETED").order_by('class_start_date','class_time')

        if search:

            qs = qs.filter(Q(class_name__icontains=search))

        if class_name:

            qs = qs.filter(class_name=class_name)

        if status_filter:

            qs = qs.filter(class_status=status_filter)

        total = qs.count()

        data = []

        for item in qs[start:end]:

            today_attendance_exists = (StudentAttendance.objects.filter(assigned_class=item,attendance_date=timezone.now().date()).exists())

            data.append({
                "id": item.id,
                "class_name": item.class_name,
                "class_time": item.class_time,
                "class_start_date": item.class_start_date,
                "class_end_date": item.class_end_date.strftime("%d-%m-%Y") if item.class_end_date else "-",
                "student_limit": item.student_limit,
                "available_slot": item.available_slot,
                "student_count": (item.student_limit - item.available_slot),
                "class_status": item.class_status,
                "count_days": (timezone.now().date() - item.class_start_date).days + 1 if item.class_start_date else 0,
                "attendance_taken": today_attendance_exists,
            })

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
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_staff_batch_classes(request):

    try:

        username = request.GET.get('username')

        classes = StaffAssignments.objects.filter(staff__username=username).values_list('class_name',flat=True).distinct()

        return JsonResponse({
            "status": "Success", 
            "data": list(classes)
        })

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_staff_completed_batches(request):

    try:

        username = request.GET.get('username')
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 5))
        search = request.GET.get('search')
        start = (page - 1) * limit
        end = (start + limit)

        qs = StaffAssignments.objects.filter(staff__username=username,class_status="COMPLETED").order_by('class_start_date','class_time')

        if search:

            qs = qs.filter(Q(class_name__icontains=search))

        total = qs.count()

        data = []

        for item in qs[start:end]:

            data.append({
                "id": item.id,
                "class_name": item.class_name,
                "class_time": item.class_time,
                "class_start_date": item.class_start_date,
                "class_end_date": item.class_end_date.strftime("%d-%m-%Y") if item.class_end_date else "-",
                "student_limit": item.student_limit,
                "available_slot": item.available_slot,
                "student_count": (item.student_limit - item.available_slot),
                "class_status":item.class_status
            })

        return JsonResponse({
            "status": "Success",
            "total": total,
            "data": data
        })

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_ongoing_batch_students(request):

    try:

        username = request.GET.get("username")
        assignment_id = request.GET.get("assignment_id") or request.GET.get("assignmentId")
        page = int(request.GET.get("page", 1))
        limit = int(request.GET.get("limit", 5))
        search = request.GET.get("search")
        status = request.GET.get('status')
        start = (page - 1) * limit
        end = start + limit

        assignment = StaffAssignments.objects.get(
            id=assignment_id, staff__username=username
        )

        qs = (
            StudentEnrollment.objects.select_related("student", "assigned_class")
            .filter(assigned_class=assignment)
            .order_by("-enrolled_date")
        )

        if search:

            qs = qs.filter(
                Q(student__username__icontains=search)
                | Q(student__email__icontains=search)
            )

        if status:

            qs = qs.filter(enrollment_status=status)

        total = qs.count()
        data = []

        for item in qs[start:end]:

            data.append(
                {
                    "id": item.id,
                    "student_name": item.student.username,
                    "email": item.student.email,
                    "phone": item.student.phone,
                    "purchased_course": item.student.purchased_course.course_name if item.student.purchased_course else "-",
                    "joined_date": item.enrolled_date.strftime("%d-%m-%Y"),
                    "status": item.enrollment_status,
                    "student_unique_id": item.student.student_unique_id,
                }
            )

        return JsonResponse({"status": "Success", "total": total, "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_student_enrollment_status(request):

    try:

        data = json.loads(request.body)
        obj = StudentEnrollment.objects.get(id=data["id"])
        obj.enrollment_status = data["enrollment_status"]
        obj.save()

        return JsonResponse({
            "status": "Success", 
            "message": "Student status updated successfully"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error", 
            "message": str(e)
        })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_completed_batch_students(request):

    try:

        username = request.GET.get("username")
        assignment_id = request.GET.get("assignment_id")
        page = int(request.GET.get("page", 1))
        limit = int(request.GET.get("limit", 5))
        search = request.GET.get("search")
        status = request.GET.get('status')
        start = (page - 1) * limit
        end = start + limit

        assignment = StaffAssignments.objects.get(
            id=assignment_id, staff__username=username
        )

        qs = (StudentEnrollment.objects.select_related("student", "assigned_class")
                .filter(assigned_class=assignment, enrollment_status__in=["COMPLETED", "DROPPED"],)
                .order_by("-enrolled_date")
        )

        if search:

            qs = qs.filter(Q(student__username__icontains=search) | Q(student__email__icontains=search))

        if status:

            qs = qs.filter(enrollment_status=status)

        total = qs.count()

        data = []

        for item in qs[start:end]:

            data.append(
                {
                    "id": item.id,
                    "student_name": item.student.username,
                    "email": item.student.email,
                    "phone": item.student.phone,
                    "purchased_course": item.student.purchased_course.course_name if item.student.purchased_course else "-",
                    "joined_date": item.enrolled_date.strftime("%d-%m-%Y"),
                    "end_date": item.assigned_class.class_end_date.strftime("%d-%m-%Y") if item.assigned_class.class_end_date else "-",
                    "status": item.enrollment_status,
                    "student_unique_id": item.student.student_unique_id,
                }
            )

        return JsonResponse({"status": "Success", "total": total, "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_student_tab_batches(request):

    try:

        username = request.GET.get("username")

        page = int(request.GET.get("page", 1))

        limit = int(request.GET.get("limit", 5))

        search = request.GET.get("search")

        class_name = request.GET.get("class_name")

        status_filter = request.GET.get("class_status")

        start = (page - 1) * limit

        end = start + limit

        qs = StaffAssignments.objects.filter(staff__username=username)

        if search:

            qs = qs.filter(Q(class_name__icontains=search))

        if class_name:

            qs = qs.filter(class_name=class_name)

        if status_filter:

            qs = qs.filter(class_status=status_filter)

        qs = qs.order_by("class_start_date", "class_time")

        total = qs.count()

        data = []

        for item in qs[start:end]:

            student_count = StudentEnrollment.objects.filter(
                assigned_class=item
            ).count()

            data.append(
                {
                    "id": item.id,
                    "class_name": item.class_name,
                    "class_time": item.class_time,
                    "class_start_date": item.class_start_date,
                    "class_end_date": item.class_end_date.strftime("%d-%m-%Y") if item.class_end_date else "-",
                    "student_limit": item.student_limit,
                    "student_count": student_count,
                    "class_status": item.class_status,
                }
            )

        return JsonResponse({"status": "Success", "total": total, "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_student_tab_students(request):

    try:

        username = request.GET.get("username")

        assignment_id = request.GET.get("assignment_id")

        page = int(request.GET.get("page", 1))

        limit = int(request.GET.get("limit", 5))

        search = request.GET.get("search")

        status = request.GET.get("status")

        start = (page - 1) * limit

        end = start + limit

        assignment = StaffAssignments.objects.get(
            id=assignment_id, staff__username=username
        )

        qs = StudentEnrollment.objects.select_related(
            "student", "assigned_class"
        ).filter(assigned_class=assignment)

        if search:

            qs = qs.filter(
                Q(student__username__icontains=search)
                | Q(student__email__icontains=search)
            )

        if status:

            qs = qs.filter(enrollment_status=status)

        total = qs.count()

        data = []

        for item in qs[start:end]:

            data.append(
                {
                    "id": item.id,
                    "student_name": item.student.username,
                    "email": item.student.email,
                    "phone": item.student.phone,
                    "purchased_course": item.student.purchased_course.course_name if item.student.purchased_course else "-",
                    "joined_date": item.enrolled_date.strftime("%d-%m-%Y"),
                    "status": item.enrollment_status,
                    "student_unique_id": item.student.student_unique_id,
                }
            )

        return JsonResponse({"status": "Success", "total": total, "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_completed_assignments(request):

    try:

        search = request.GET.get("search", "")

        timing = request.GET.get("timing", "")

        class_name = request.GET.get("class_name", "")

        page = int(request.GET.get("page", 1))

        limit = int(request.GET.get("limit", 5))

        queryset = (
            StaffAssignments.objects.filter(class_status="COMPLETED")
            .select_related("staff")
            .order_by("-class_end_date")
        )

        # SEARCH

        if search:

            queryset = queryset.filter(
                Q(staff__username__icontains=search)
                | Q(class_name__icontains=search)
            )

        # TIMING FILTER

        if timing:

            queryset = queryset.filter(class_time=timing)

        # CLASS FILTER

        if class_name:

            queryset = queryset.filter(class_name=class_name)

        total = queryset.count()

        start = (page - 1) * limit

        end = start + limit

        paginated_queryset = queryset[start:end]

        data = []

        for item in paginated_queryset:

            student_count = StudentEnrollment.objects.filter(assigned_class=item).count()

            data.append(
                {
                    "id": item.id,
                    "staff_name": item.staff.username,
                    "class_name": item.class_name,
                    "class_time": item.class_time,
                    "assigned_date": item.assigned_date.strftime("%Y-%m-%d") if item.assigned_date else "-",
                    "class_start_date": item.class_start_date.strftime("%Y-%m-%d") if item.class_start_date else "-",
                    "class_end_date": item.class_end_date.strftime("%Y-%m-%d") if item.class_end_date else "-",
                    "student_count": item.student_limit,
                    "class_status": item.class_status,
                }
            )

        # DYNAMIC FILTERS

        available_timings = list(
            StaffAssignments.objects.filter(class_status="COMPLETED")
            .values_list("class_time", flat=True)
            .distinct()
        )

        available_classes = list(
            StaffAssignments.objects.filter(class_status="COMPLETED")
            .values_list("class_name", flat=True)
            .distinct()
        )

        return JsonResponse(
            {
                "status": "Success",
                "data": data,
                "total": total,
                "available_timings": available_timings,
                "available_classes": available_classes,
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_student_attendance(request):

    try:

        data = json.loads(request.body)

        attendance_data = data.get("attendance")

        assignment_id = data.get("assignment_id")

        attendance_date = data.get("attendance_date")

        current_staff = UserDetails.objects.get(username=request.user.username)

        assigned_class = StaffAssignments.objects.get(id=assignment_id)

        for item in attendance_data:

            enrollment = StudentEnrollment.objects.get(id=item["student_enrollment_id"])

            StudentAttendance.objects.update_or_create(
                student_enrollment=enrollment,
                assigned_class=assigned_class,
                attendance_date=attendance_date,
                defaults={
                    "attendance_status": item["attendance_status"],
                    "marked_by": current_staff,
                },
            )

        return JsonResponse(
            {"status": "Success", "message": "Attendance saved successfully"}
        )

    except Exception as e:

        return JsonResponse({"status": "Failed", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_attendance_history(request):

    try:

        assignment_id = request.GET.get("assignment_id")

        assignment = StaffAssignments.objects.get(id=assignment_id)

        attendance_dates = (
            StudentAttendance.objects.filter(assigned_class=assignment)
            .values_list("attendance_date", flat=True)
            .distinct()
            .order_by("-attendance_date")
        )

        total_students = StudentEnrollment.objects.filter(
            assigned_class=assignment
        ).count()

        data = []

        for attendance_date in attendance_dates:

            present_count = StudentAttendance.objects.filter(
                assigned_class=assignment,
                attendance_date=attendance_date,
                attendance_status="PRESENT",
            ).count()

            absent_count = StudentAttendance.objects.filter(
                assigned_class=assignment,
                attendance_date=attendance_date,
                attendance_status="ABSENT",
            ).count()

            present_percentage = (
                round((present_count / total_students) * 100, 1)
                if total_students
                else 0
            )

            absent_percentage = (
                round((absent_count / total_students) * 100, 1) if total_students else 0
            )

            count_days = ((attendance_date - assignment.class_start_date).days) + 1

            data.append(
                {
                    "attendance_date": attendance_date.strftime("%d-%m-%Y"),
                    "attendance_date_raw": attendance_date.strftime("%Y-%m-%d"),
                    "total_students": total_students,
                    "present_count": present_count,
                    "absent_count": absent_count,
                    "present_percentage": present_percentage,
                    "absent_percentage": absent_percentage,
                    "count_days": count_days,
                }
            )

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_attendance_day_details(request):

    try:

        assignment_id = request.GET.get("assignment_id")

        attendance_date = request.GET.get("attendance_date")

        attendance = (StudentAttendance.objects.select_related("student_enrollment__student")
            .filter(
                assigned_class_id=assignment_id,
                attendance_date=attendance_date
            )
        )

        data = []

        for item in attendance:

            student = item.student_enrollment.student

            data.append({

                "student_unique_id": student.student_unique_id,
                "student_name": student.username,
                "email": student.email,
                "phone": student.phone,
                "status": item.student_enrollment.enrollment_status,
                "attendance_status": item.attendance_status,
                "student_enrollment_id": item.student_enrollment.id,
            })

        return JsonResponse({
            "status": "Success",
            "data": data
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })