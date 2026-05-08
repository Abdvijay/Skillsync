import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Classes
from datetime import date
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
    