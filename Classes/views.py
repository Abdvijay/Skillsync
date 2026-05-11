import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Classes, StaffAssignments
from datetime import date, datetime
from django.db.models import Q
from UserDetails.models import UserDetails

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_class(request):

    try:

        data = json.loads(request.body)

        # ✅ Check already assigned
        already_assigned = Classes.objects.filter(
            staff_name=data['staff_name'],
            availability="NOT AVAILABLE"
        ).exists()

        if already_assigned:

            return JsonResponse({
                "status": "Error",
                "message": "Staff already handling another class"
            })

        obj = Classes.objects.create(

            class_name=data['class_name'],

            staff_name=data['staff_name'],

            availability="AVAILABLE",

            assigned_date=date.today(),

            created_by=data['created_by']
        )

        return JsonResponse({
            "status": "Success",
            "message": "Class assigned successfully"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_classes(request):

    try:

        page = int(request.GET.get('page', 1))

        limit = int(request.GET.get('limit', 5))

        search = request.GET.get('search')

        availability = request.GET.get('availability')

        start = (page - 1) * limit

        end = start + limit

        qs = UserDetails.objects.filter(role="STAFF")

        # ✅ Single Search
        if search:

            qs = qs.filter(
                Q(username__icontains=search) |
                Q(class_name__icontains=search)
            )

        # ✅ Availability Filter
        if availability:

            qs = qs.filter(
                availability=availability
            )

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
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_class(request):

    try:

        data = json.loads(request.body)

        obj = Classes.objects.get(id=data['id'])

        obj.class_name = data['class_name']

        obj.staff_name = data['staff_name']

        obj.save()

        return JsonResponse({
            "status": "Success",
            "message": "Class updated successfully"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_class(request):

    try:

        data = json.loads(request.body)

        obj = Classes.objects.get(id=data['id'])

        obj.delete()

        return JsonResponse({
            "status": "Success",
            "message": "Class removed successfully"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    
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
            "Data" : data
        })

        obj.save()

        return JsonResponse({
            "status": "Success",
            "message": "Staff assigned successfully"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_staff_timing(request):

    try:

        data = json.loads(request.body)

        obj = UserDetails.objects.get(id=data['id'])

        obj.class_time = data['class_time']

        if obj.class_time == "":
            return JsonResponse({
            "status": "Error",
            "message": "Please Choose Atleast One Timing",
            "Data" : data
        })

        obj.save()

        return JsonResponse({
            "status": "Success",
            "message": "Timing updated successfully",
            "Data" : data
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })
    
# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def revoke_assignment(request):

#     try:

#         data = json.loads(request.body)

#         obj = UserDetails.objects.get(id=data['id'])

#         obj.availability = "AVAILABLE"

#         obj.class_time = "None"

#         obj.assigned_date = None

#         obj.available_date = None

#         obj.save()

#         return JsonResponse({
#             "status": "Success",
#             "message": "Assignment revoked successfully"
#         })

#     except Exception as e:

#         return JsonResponse({
#             "status": "Error",
#             "message": str(e)
#         })
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_assignment(request):

    try:

        data = json.loads(request.body)

        staff_id = data['staff_id']

        class_name = data['class_name']

        class_time = data['class_time']

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

        # ✅ Prevent same timing duplicate
        already_exists = StaffAssignments.objects.filter(
            staff_id=staff_id,
            class_time=class_time,
            status="ACTIVE"
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

            assigned_by=request.user.username
        )

        return JsonResponse({
            "status": "Success",
            "message": "Assignment created successfully"
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

        page = int(request.GET.get('page', 1))

        limit = int(request.GET.get('limit', 5))

        search = request.GET.get('search')

        time_filter = request.GET.get('class_time')

        start = (page - 1) * limit

        end = start + limit

        qs = StaffAssignments.objects.select_related('staff')

        if search:

            qs = qs.filter(
                Q(staff__username__icontains=search) |
                Q(class_name__icontains=search)
            )

        if time_filter:

             qs = qs.filter(class_time=time_filter)

        total = qs.count()

        data = []

        for item in qs[start:end]:

            data.append({

                "id": item.id,

                "staff_name": item.staff.username,

                "class_name": item.class_name,

                "class_time": item.class_time,

                "status": item.status,

                "assigned_date": item.assigned_date,

                "available_date": item.available_date
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
            status="ACTIVE"
        ).exclude(id=obj.id).exists()

        if already_exists:

            return JsonResponse({
                "status": "Error",
                "message": "Timing already assigned"
            })

        obj.class_time = data['class_time']

        if obj.class_time == "":
             return JsonResponse({
                "status": "Error",
                "message": "Cannot assign without selecting timing...!!!"
            })

        obj.save()

        return JsonResponse({
            "status": "Success",
            "message": "Timing updated successfully"
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

        timings = StaffAssignments.objects.filter(status="ACTIVE").values_list('class_time',flat=True).distinct()
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