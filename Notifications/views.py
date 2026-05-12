from rest_framework.decorators import api_view,permission_classes

from rest_framework.permissions import (IsAuthenticated)

from django.http import JsonResponse

from .models import Notifications

import json

from django.db.models import Q


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_notification(request):

    try:

        data = json.loads(request.body)

        Notifications.objects.create(

            posted_by=data['posted_by'],

            category=data['category'],

            content=data['content'],

            priority=data['priority'],

            extra_data=data.get('extra_data',{})
        )

        return JsonResponse({
            "status": "Success",
            "message": "Notification Added"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request):

    try:
        search = request.GET.get("search", "")
        category = request.GET.get("category", "")
        page = int(request.GET.get("page", 1))
        limit = int(request.GET.get("limit", 5))
        queryset = Notifications.objects.all()

        if search:

            queryset = queryset.filter(
                  Q(posted_by__icontains=search)
                | Q(category__icontains=search)
                | Q(content__icontains=search)
            )

        if category:

            queryset = queryset.filter(category=category)

        total = queryset.count()
        start = (page - 1) * limit
        end = start + limit
        notifications  = list(queryset.values()[start:end])

        return JsonResponse({"status": "Success", "data": notifications, "total": total})

    except Exception as e:

        return JsonResponse({"status": "Error", "message": str(e)})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_notification(request):

    try:

        data = json.loads(request.body)

        obj = Notifications.objects.get(
            id=data['id']
        )

        if obj.posted_by != request.user.username:

            return JsonResponse({
                "status": "Error",
                "message": "Unauthorized"
            })

        obj.category = data['category']

        obj.content = data['content']

        obj.priority = data['priority']

        obj.extra_data = data.get('extra_data',{})

        obj.edited = True

        obj.save()

        return JsonResponse({
            "status": "Success",
            "message": "Notification Updated"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request):

    try:

        data = json.loads(request.body)

        obj = Notifications.objects.get(
            id=data['id']
        )

        if obj.posted_by != request.user.username:

            return JsonResponse({
                "status": "Error",
                "message": "Unauthorized"
            })

        obj.delete()

        return JsonResponse({
            "status": "Success",
            "message": "Notification Deleted"
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })