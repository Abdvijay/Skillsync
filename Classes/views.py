import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Classes, StaffAssignments
from datetime import date, datetime, timedelta
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

        StaffAssignments.objects.filter(class_start_date__lte = today, class_status = "OPEN").update(class_status = "ONGOING")

        page = int(request.GET.get('page', 1))

        limit = int(request.GET.get('limit', 5))

        search = request.GET.get('search')

        time_filter = request.GET.get('class_time')

        status_filter = request.GET.get('class_status')

        start = (page - 1) * limit

        end = start + limit

        qs = (StaffAssignments.objects.select_related("staff")
                .filter(
                    class_start_date__gt=today,
                    class_status__in=["OPEN","FULL"]
                )
                .order_by(
                    "class_start_date",
                    "class_time"
                )
            )

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

        # DYNAMIC FILTERS

        available_timings = sorted(list(
            StaffAssignments.objects.filter(
                class_start_date__gt=today, class_status__in=["OPEN", "FULL"]
            )
            .values_list("class_time", flat=True)
            .distinct()
            ),
            key=lambda x:datetime.strptime(x.split("-")[0].strip(),"%I %p")
        )

        available_classes = list(
            StaffAssignments.objects.filter(
                class_start_date__gt=today, class_status__in=["OPEN", "FULL"]
            )
            .values_list("class_name", flat=True)
            .distinct()
        )

        return JsonResponse({
            "status": "Success",
            "total": total,
            "data": data,
            "available_timings": available_timings,
            "available_classes": available_classes
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_assignment_timing(request):

    try:

        data = json.loads(request.body)

        obj = StaffAssignments.objects.get(id=data["id"])

        # PREVENT DUPLICATE TIMING

        already_exists = (
            StaffAssignments.objects.filter(
                staff=obj.staff,
                class_time=data["class_time"],
            )
            .exclude(id=obj.id)
            .exists()
        )

        if already_exists:

            return JsonResponse(
                {"status": "Error", "message": "Timing already assigned"}
            )

        # VALIDATIONS

        if data.get("class_time", "") == "":

            return JsonResponse(
                {
                    "status": "Error",
                    "message": "Cannot assign without selecting timing...!!!",
                }
            )

        if data.get("class_start_date", "") == "":

            return JsonResponse(
                {
                    "status": "Error",
                    "message": "Cannot assign without selecting class_start_date...!!!",
                }
            )

        if data.get("student_limit", "") == "":

            return JsonResponse(
                {
                    "status": "Error",
                    "message": "Cannot assign without selecting student_limit...!!!",
                }
            )

        if data.get("class_status", "") == "":

            return JsonResponse(
                {
                    "status": "Error",
                    "message": "Cannot assign without selecting class_status...!!!",
                }
            )

        old_status = obj.class_status
        new_status = data["class_status"]

        # UPDATE FIELDS

        obj.class_time = data["class_time"]
        obj.class_start_date = datetime.strptime(data["class_start_date"], "%Y-%m-%d").date()
        obj.student_limit = data["student_limit"]

        today = timezone.now().date()

        # COMPLETED → SET END DATE

        if new_status == "COMPLETED" and old_status != "COMPLETED":

            obj.class_status = "COMPLETED"
            obj.class_end_date = today

        # REMOVE END DATE IF REOPENED

        elif old_status == "COMPLETED" and new_status != "COMPLETED":

            obj.class_end_date = None

        # GENERAL STATUS HANDLING

        # FUTURE START DATE

        if obj.class_start_date > today:

            # NOT ALLOWED

            if new_status == "COMPLETED":

                return JsonResponse({
                    "status": "Error",
                    "message":"Cannot complete class before start date."
                })

            # FUTURE BATCH
            # ONLY OPEN OR FULL

            if new_status in ["OPEN","FULL"]:
                obj.class_status = new_status
            else:
                obj.class_status = "OPEN"

        # TODAY OR PAST DATE

        else:
            # COMPLETED
            if new_status == "COMPLETED":
                obj.class_status = "COMPLETED"

            # FULL NOT NEEDED
            # CONVERT TO ONGOING

            elif new_status == "FULL":
                obj.class_status = "ONGOING"

            # OPEN → ONGOING

            elif new_status in ["OPEN","ONGOING"]:
                obj.class_status = "ONGOING"

            else:
                obj.class_status = "ONGOING"

        # STUDENT STATUS UPDATE

        if obj.class_status == "COMPLETED":

            StudentEnrollment.objects.filter(
                assigned_class=obj, enrollment_status="ACTIVE"
            ).update(enrollment_status="COMPLETED")

        elif obj.class_status in ["OPEN", "ONGOING", "FULL"]:

            StudentEnrollment.objects.filter(
                assigned_class=obj, enrollment_status="COMPLETED"
            ).update(enrollment_status="ACTIVE")

        obj.save()

        return JsonResponse(
            {
                "status": "Success",
                "message": "updated successfully",
                "data": {
                    "id": obj.id,
                    "class_status": obj.class_status,
                    "class_start_date": str(obj.class_start_date),
                    "class_end_date": (obj.class_end_date.strftime("%d-%m-%Y") if obj.class_end_date else None),
                },
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_assignment_timings(request):

    try:

        today = date.today()

        timings = (
            StaffAssignments.objects.filter(
                class_start_date__gt=today, class_status__in=["OPEN", "FULL"]
            )
            .values_list("class_time", flat=True)
            .distinct()
        )

        timings = sorted(
            timings, key=lambda x: datetime.strptime(x.split(" - ")[0].strip(), "%I %p")
        )

        return JsonResponse({"status": "Success", "data": list(timings)})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
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

        today = timezone.now().date()

        StaffAssignments.objects.filter(class_start_date__lte=today, class_status="OPEN").update(class_status="ONGOING")

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

            today = timezone.now().date()

            display_status = item.class_status

            if item.class_status != "COMPLETED":

            # FUTURE BATCH

                if item.class_start_date > today:

                    display_status = "FULL" if item.available_slot == 0 else "OPEN"

                # STARTED BATCH

                else:

                    display_status = "ONGOING"

            data.append({
                "id": item.id,
                "class_name": item.class_name,
                "class_time": item.class_time,
                "class_start_date": item.class_start_date,
                "class_end_date": item.class_end_date.strftime("%d-%m-%Y") if item.class_end_date else "-",
                "student_limit": item.student_limit,
                "available_slot": item.available_slot,
                "student_count": (item.student_limit - item.available_slot),
                "class_status": display_status,
                "count_days": (

                    # COMPLETED CLASS

                    (item.class_end_date - item.class_start_date).days + 1

                    if (item.class_status == "COMPLETED" and item.class_end_date and item.class_start_date)

                    # FUTURE START DATE

                    else "-"

                    if (item.class_start_date and item.class_start_date > timezone.now().date())

                    # ONGOING / STARTED

                    else ((timezone.now().date() - item.class_start_date).days + 1)

                    if item.class_start_date

                    else 0
                ),
                "attendance_taken": today_attendance_exists,
                "can_take_attendance": item.class_start_date <= date.today()
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
                "class_end_date": item.class_end_date.strftime("%Y-%m-%d") if item.class_end_date else "-",
                "student_limit": item.student_limit,
                "available_slot": item.available_slot,
                "student_count": (item.student_limit - item.available_slot),
                "class_status":item.class_status,
                "count_days": (
                    (item.class_end_date - item.class_start_date).days + 1 if (item.class_status == "COMPLETED" and item.class_end_date and item.class_start_date)
                    else ((timezone.now().date() - item.class_start_date).days + 1 if item.class_start_date else 0)
                ),
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

            attendance_records = StudentAttendance.objects.filter(student_enrollment=item)

            total_attendance_days = attendance_records.count()

            present_days = attendance_records.filter(attendance_status="PRESENT").count()

            attendance_percentage = 0

            if total_attendance_days > 0:

                attendance_percentage = round((present_days / total_attendance_days) * 100, 2)

            if total_attendance_days == 0:

                attendance_percentage = "-"

            data.append(
                {
                    "id": item.id,
                    "student_name": item.student.username,
                    "email": item.student.email,
                    "phone": item.student.phone,
                    "purchased_course": item.student.purchased_course.course_name if item.student.purchased_course else "-",
                    "joined_date": item.enrolled_date.strftime("%Y-%m-%d"),
                    "status": item.enrollment_status,
                    "attendance_percentage": attendance_percentage,
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

            attendance_records = StudentAttendance.objects.filter(student_enrollment=item)

            total_attendance_days = attendance_records.count()

            present_days = attendance_records.filter(attendance_status="PRESENT").count()

            attendance_percentage = "-"

            if total_attendance_days > 0:

                attendance_percentage = round((present_days / total_attendance_days) * 100, 2)

            data.append(
                {
                    "id": item.id,
                    "student_name": item.student.username,
                    "email": item.student.email,
                    "phone": item.student.phone,
                    "purchased_course": item.student.purchased_course.course_name if item.student.purchased_course else "-",
                    "joined_date": item.enrolled_date.strftime("%Y-%m-%d"),
                    "end_date": item.assigned_class.class_end_date.strftime("%Y-%m-%d") if item.assigned_class.class_end_date else "-",
                    "status": item.enrollment_status,
                    "attendance_percentage": attendance_percentage,
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

            today = timezone.now().date()

            display_status = item.class_status

            if item.class_status != "COMPLETED":

                if item.class_start_date > today:

                    display_status = "OPEN"

                elif item.class_status in ["OPEN", "ONGOING", "FULL"]:

                    display_status = "ONGOING" if item.available_slot > 0 else "FULL"

            data.append(
                {
                    "id": item.id,
                    "class_name": item.class_name,
                    "class_time": item.class_time,
                    "class_start_date": item.class_start_date,
                    "class_end_date": item.class_end_date.strftime("%Y-%m-%d") if item.class_end_date else "-",
                    "student_limit": item.student_limit,
                    "student_count": student_count,
                    "class_status": display_status,
                    "count_days": (
                        (item.class_end_date - item.class_start_date).days + 1 if (item.class_status == "COMPLETED" and item.class_end_date and item.class_start_date)
                        else ((timezone.now().date() - item.class_start_date).days + 1 if item.class_start_date else 0)
                    ),
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

            attendance_records = StudentAttendance.objects.filter(student_enrollment=item)

            total_attendance_days = attendance_records.count()

            present_days = attendance_records.filter(attendance_status="PRESENT").count()

            attendance_percentage = "-"

            if total_attendance_days > 0:

                attendance_percentage = round((present_days / total_attendance_days) * 100, 2)

            data.append(
                {
                    "id": item.id,
                    "student_name": item.student.username,
                    "email": item.student.email,
                    "phone": item.student.phone,
                    "purchased_course": item.student.purchased_course.course_name if item.student.purchased_course else "-",
                    "joined_date": item.enrolled_date.strftime("%Y-%m-%d"),
                    "status": item.enrollment_status,
                    "attendance_percentage" : attendance_percentage,
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

        saved_data = []

        present_count = 0
        absent_count = 0

        for item in attendance_data:

            enrollment = StudentEnrollment.objects.get(id=item["student_enrollment_id"])

            attendance_obj, created = StudentAttendance.objects.update_or_create(
                student_enrollment=enrollment,
                assigned_class=assigned_class,
                attendance_date=attendance_date,
                defaults={
                    "attendance_status": item["attendance_status"],
                    "marked_by": current_staff,
                },
            )

            if attendance_obj.attendance_status == "PRESENT":
                present_count += 1
            else:
                absent_count += 1

            saved_data.append(
                {
                    "student_id": enrollment.student.id,
                    "student_name": enrollment.student.username,
                    "attendance_status": attendance_obj.attendance_status,
                }
            )

        return JsonResponse(
            {
                "status": "Success",
                "message": "Attendance saved successfully",
                "attendance_date": attendance_date,
                "total_students": len(attendance_data),
                "present_count": present_count,
                "absent_count": absent_count,
                "saved_data": saved_data,
            }
        )

    except Exception as e:

        return JsonResponse({"status": "Failed", "message": str(e)})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_attendance_history(request):

    try:

        assignment_id = request.GET.get("assignment_id")

        assignment = StaffAssignments.objects.get(id=assignment_id)

        today = timezone.now().date()

        total_students = StudentEnrollment.objects.filter(
            assigned_class=assignment
        ).count()

        # EXISTING ATTENDANCE DATES

        attendance_dates = (
            StudentAttendance.objects.filter(assigned_class=assignment)
            .values_list("attendance_date", flat=True)
            .distinct()
        )

        attendance_dates_set = set(attendance_dates)

        data = []

        current_date = assignment.class_start_date

        while current_date <= today:

            # ATTENDANCE EXISTS

            if current_date in attendance_dates_set:

                present_count = StudentAttendance.objects.filter(
                    assigned_class=assignment,
                    attendance_date=current_date,
                    attendance_status="PRESENT",
                ).count()

                absent_count = StudentAttendance.objects.filter(
                    assigned_class=assignment,
                    attendance_date=current_date,
                    attendance_status="ABSENT",
                ).count()

                present_percentage = (
                    round(
                        (present_count / total_students) * 100,
                        1,
                    )
                    if total_students
                    else 0
                )

                absent_percentage = (
                    round(
                        (absent_count / total_students) * 100,
                        1,
                    )
                    if total_students
                    else 0
                )

                count_days = ((current_date - assignment.class_start_date).days) + 1

                data.append(
                    {
                        "attendance_date": current_date.strftime("%Y-%m-%d"),
                        "attendance_date_raw": current_date.strftime("%Y-%m-%d"),
                        "total_students": total_students,
                        "present_count": present_count,
                        "absent_count": absent_count,
                        "present_percentage": present_percentage,
                        "absent_percentage": absent_percentage,
                        "count_days": count_days,
                    }
                )

            # MISSED ATTENDANCE

            else:

                count_days = ((current_date - assignment.class_start_date).days) + 1

                data.append(
                    {
                        "attendance_date": current_date.strftime("%Y-%m-%d"),
                        "attendance_date_raw": current_date.strftime("%Y-%m-%d"),
                        "total_students": total_students,
                        "present_count": "-",
                        "absent_count": "-",
                        "present_percentage": None,
                        "absent_percentage": None,
                        "count_days": count_days,
                    }
                )

            current_date += timedelta(days=1)

        # LATEST FIRST

        data.sort(key=lambda x: x["attendance_date_raw"], reverse=True)

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_attendance_day_details(request):

    try:

        assignment_id = request.GET.get("assignment_id")

        attendance_date = request.GET.get("attendance_date")

        search = request.GET.get("search", "").strip()

        attendance = StudentAttendance.objects.select_related(
            "student_enrollment__student"
        ).filter(assigned_class_id=assignment_id, attendance_date=attendance_date)

        # SEARCH FILTER

        if search:

            attendance = attendance.filter(
                Q(student_enrollment__student__student_unique_id__icontains=search)
                | Q(student_enrollment__student__username__icontains=search)
            )

        data = []

        for item in attendance:

            student = item.student_enrollment.student

            data.append(
                {
                    "student_unique_id": student.student_unique_id,
                    "student_name": student.username,
                    "email": student.email,
                    "phone": student.phone,
                    "status": item.student_enrollment.enrollment_status,
                    "attendance_status": item.attendance_status,
                    "student_enrollment_id": item.student_enrollment.id,
                }
            )

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_attendance_tab_day_details(request):

    try:

        assignment_id = request.GET.get("assignment_id")

        attendance_date = request.GET.get("attendance_date")

        search = request.GET.get("search","").strip()

        print("Search Query:", search)

        qs = StudentAttendance.objects.select_related(
            "student_enrollment__student"
        ).filter(assigned_class_id=assignment_id, attendance_date=attendance_date)

        # SEARCH

        if search:

            qs = qs.filter(
                Q(student_enrollment__student__student_unique_id__icontains=search)
                | Q(student_enrollment__student__username__icontains=search)
                | Q(student_enrollment__student__email__icontains=search)
            )

            print("FILTERED COUNT:", qs.count())


        data = []

        for item in qs:

            student = item.student_enrollment.student

            data.append(
                {
                    "student_unique_id": student.student_unique_id,
                    "student_name": student.username,
                    "email": student.email,
                    "phone": student.phone,
                    "status": item.student_enrollment.enrollment_status,
                    "attendance_status": item.attendance_status,
                }
            )

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_staff_dashboard_cards(request):

    try:

        username = request.GET.get("username")

        staff_classes = StaffAssignments.objects.filter(staff__username=username)

        total_classes = staff_classes.count()

        active_classes = staff_classes.filter(
            class_status__in=["ONGOING", "FULL"]
        ).count()

        total_students = StudentEnrollment.objects.filter(
            assigned_class__in=staff_classes
        ).count()

        today = timezone.now().date()

        today_classes = staff_classes.filter(class_status__in=["ONGOING", "FULL"])

        attendance_taken = 0

        attendance_pending = 0

        for item in today_classes:

            student_count = (
                StudentEnrollment.objects.filter(assigned_class=item).count()
            )

            # SKIP ZERO STUDENT CLASS

            if student_count == 0:
                continue

            attendance_exists = StudentAttendance.objects.filter(
                assigned_class=item, attendance_date=today
            ).exists()

            if attendance_exists:

                attendance_taken += 1

            else:

                attendance_pending += 1

        return JsonResponse({
                "status": "Success",
                "data": {
                    "total_classes": total_classes,
                    "active_classes": active_classes,
                    "total_students": total_students,
                    "attendance_taken": attendance_taken,
                    "attendance_pending": attendance_pending,
                },
        })

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_staff_dashboard_active_classes(request):

    try:

        username = request.GET.get("username")

        today = timezone.now().date()

        qs = StaffAssignments.objects.filter(
            staff__username=username, class_status__in=["ONGOING", "FULL"]
        ).order_by("class_time")

        data = []

        for item in qs:

            student_count = StudentEnrollment.objects.filter(
                assigned_class=item
            ).count()

            attendance_taken = StudentAttendance.objects.filter(
                assigned_class=item, attendance_date=today
            ).exists()

            # ATTENDANCE STATUS LOGIC

            if student_count == 0: 
                attendance_status = "-"
            else:
                attendance_status = ("Taken" if attendance_taken else "Pending")

            data.append(
                {
                    "class_name": item.class_name,
                    "class_time": item.class_time,
                    "student_count": student_count,
                    "class_status": item.class_status,
                    "attendance_status": attendance_status,
                }
            )

        status_summary = {
            "open_count": StaffAssignments.objects.filter(
                staff__username=username, class_status="OPEN"
            ).count(),
            "ongoing_count": StaffAssignments.objects.filter(
                staff__username=username, class_status="ONGOING"
            ).count(),
            "full_count": StaffAssignments.objects.filter(
                staff__username=username, class_status="FULL"
            ).count(),
            "completed_count": StaffAssignments.objects.filter(
                staff__username=username, class_status="COMPLETED"
            ).count(),
        }

        return JsonResponse(
            {"status": "Success", "data": data, "summary": status_summary}
        )

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def ongoing_batch_assignment_management(request):

    try:

        page = int(request.GET.get("page", 1))

        limit = 5

        search = request.GET.get("search", "").strip()

        timing = request.GET.get("timing", "")

        class_name = request.GET.get("class_name", "")

        start = (page - 1) * limit

        end = start + limit

        today = date.today()

        today = date.today()

        StaffAssignments.objects.filter(class_start_date__lte=today, class_status="OPEN").update(class_status="ONGOING")

        assignments = (StaffAssignments.objects.select_related("staff").filter(class_start_date__lte=today,class_status__in=["ONGOING","FULL"]))

        # STAFF SEARCH

        if search:

            assignments = assignments.filter(staff__username__icontains=search)

        # TIMING FILTER

        if timing:

            assignments = assignments.filter(class_time=timing)

        # CLASS FILTER

        if class_name:

            assignments = assignments.filter(class_name=class_name)

        total = assignments.count()

        assignments = assignments.order_by("-assigned_date")[start:end]

        data = []

        for item in assignments:

            joined_student_count = StudentEnrollment.objects.filter(
                assigned_class=item
            ).count()

            data.append(
                {
                    "id": item.id,
                    "staff_name": item.staff.username,
                    "class_name": item.class_name,
                    "timing": item.class_time,
                    "assigned_date": item.assigned_date.strftime("%d-%m-%Y"),
                    "start_date": item.class_start_date.strftime("%d-%m-%Y"),
                    "end_date": "-",
                    "joined_students": joined_student_count,
                    "student_limit": item.student_limit,
                    "class_status": item.class_status,
                }
            )
        
        available_timings = sorted(list(
            StaffAssignments.objects.filter(
                class_start_date__lte=today, class_status__in=["ONGOING", "FULL"]
            )
            .values_list("class_time", flat=True)
            .distinct()
        ),
            key=lambda x:datetime.strptime(x.split("-")[0].strip(),"%I %p"
        ))

        available_classes = list(
            StaffAssignments.objects.filter(
                class_start_date__lte=today, class_status__in=["ONGOING", "FULL"]
            )
            .values_list("class_name", flat=True)
            .distinct()
        )

        return JsonResponse({
            "status": "Success", 
            "total": total, 
            "data": data,
            "available_timings": available_timings,
            "available_classes": available_classes
        })

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_student_attendance_progress(request):

    try:

        student_enrollment_id = request.GET.get("student_enrollment_id")

        enrollment = StudentEnrollment.objects.select_related("assigned_class").get(
            id=student_enrollment_id
        )

        assignment = enrollment.assigned_class

        start_date = assignment.class_start_date

        if not start_date:

            return JsonResponse({
                "status": "Success",
                "data": []
            })

        end_date = timezone.now().date()

        data = []

        current_date = start_date

        while current_date <= end_date:

            attendance = StudentAttendance.objects.filter(
                student_enrollment=enrollment, attendance_date=current_date
            ).first()

            attendance_status = attendance.attendance_status if attendance else "-"

            count_days = ((current_date - start_date).days) + 1

            data.append(
                {
                    "attendance_date": current_date.strftime("%Y-%m-%d"),
                    "count_days": count_days,
                    "attendance_status": attendance_status,
                }
            )

            current_date += timedelta(days=1)

        data.reverse()

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_completed_student_attendance_progress(request):

    try:

        student_enrollment_id = request.GET.get("student_enrollment_id")

        enrollment = StudentEnrollment.objects.select_related("assigned_class").get(
            id=student_enrollment_id
        )

        assignment = enrollment.assigned_class

        start_date = assignment.class_start_date

        end_date = assignment.class_end_date

        data = []

        current_date = start_date

        while current_date <= end_date:

            attendance = StudentAttendance.objects.filter(
                student_enrollment=enrollment, attendance_date=current_date
            ).first()

            attendance_status = attendance.attendance_status if attendance else "-"

            count_days = ((current_date - start_date).days) + 1

            data.append(
                {
                    "attendance_date": current_date.strftime("%Y-%m-%d"),
                    "count_days": count_days,
                    "attendance_status": attendance_status,
                }
            )

            current_date += timedelta(days=1)

        data.reverse()

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_students_tab_attendance_progress(request):

    try:

        student_enrollment_id = request.GET.get("student_enrollment_id")

        enrollment = StudentEnrollment.objects.select_related("assigned_class").get(
            id=student_enrollment_id
        )

        assignment = enrollment.assigned_class

        start_date = assignment.class_start_date

        if assignment.class_end_date:

            end_date = assignment.class_end_date

        else:

            end_date = timezone.now().date()

        data = []

        current_date = start_date

        while current_date <= end_date:

            attendance = StudentAttendance.objects.filter(
                student_enrollment=enrollment, attendance_date=current_date
            ).first()

            attendance_status = attendance.attendance_status if attendance else "-"

            count_days = ((current_date - start_date).days) + 1

            data.append(
                {
                    "attendance_date": current_date.strftime("%Y-%m-%d"),
                    "count_days": count_days,
                    "attendance_status": attendance_status,
                }
            )

            current_date += timedelta(days=1)

        data.reverse()

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_admin_student_attendance_progress(request):

    try:

        student_enrollment_id = request.GET.get("student_enrollment_id")

        enrollment = StudentEnrollment.objects.select_related("assigned_class").get(
            id=student_enrollment_id
        )

        assignment = enrollment.assigned_class

        start_date = assignment.class_start_date

        if not start_date:

            return JsonResponse({

                "status": "Success",

                "data": []

            })

        # COMPLETED CLASS

        if assignment.class_status == "COMPLETED" and assignment.class_end_date:

            end_date = assignment.class_end_date

        else:

            end_date = timezone.now().date()

        data = []

        current_date = start_date

        while current_date <= end_date:

            attendance = StudentAttendance.objects.filter(
                student_enrollment=enrollment, attendance_date=current_date
            ).first()

            attendance_status = attendance.attendance_status if attendance else "-"

            count_days = (current_date - start_date).days + 1

            data.append(
                {
                    "attendance_date": current_date.strftime("%Y-%m-%d"),
                    "count_days": count_days,
                    "attendance_status": attendance_status,
                }
            )

            current_date += timedelta(days=1)

        data.reverse()

        return JsonResponse({"status": "Success", "data": data})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_student_ongoing_classes(request):

    try:

        username = request.GET.get("username")

        page = int(request.GET.get("page", 1))

        limit = int(request.GET.get("limit", 5))

        search = request.GET.get("search", "")

        start = (page - 1) * limit

        end = start + limit

        enrollments = (
            StudentEnrollment.objects.select_related(
                "student", "assigned_class", "assigned_class__staff"
            )
            .filter(student__username=username, enrollment_status="ACTIVE")
            .order_by("assigned_class__class_start_date")
        )

        if search:

            enrollments = enrollments.filter(
                Q(assigned_class__class_name__icontains=search)
                | Q(assigned_class__staff__username__icontains=search)
            )

        total = enrollments.count()

        data = []

        for enrollment in enrollments[start:end]:

            attendance = StudentAttendance.objects.filter(
                student_enrollment=enrollment, attendance_status="PRESENT"
            ).count()

            total_attendance = StudentAttendance.objects.filter(
                student_enrollment=enrollment
            ).count()

            attendance_percentage = (
                round((attendance / total_attendance) * 100, 2)
                if total_attendance
                else 0
            )

            data.append(
                {
                    "id": enrollment.id,
                    "class_name": enrollment.assigned_class.class_name,
                    "trainer": enrollment.assigned_class.staff.username,
                    "timing": enrollment.assigned_class.class_time,
                    "start_date": enrollment.assigned_class.class_start_date.strftime(
                        "%d-%m-%Y"
                    ),
                    "attendance_percentage": attendance_percentage,
                    "status": enrollment.enrollment_status,
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

        return JsonResponse(
            {
                "status": "Error",
                "message": str(e),
            }
        )