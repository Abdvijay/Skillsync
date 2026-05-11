from rest_framework.decorators import api_view,permission_classes

from rest_framework.permissions import (IsAuthenticated)

from django.http import JsonResponse

from .models import Notifications

import json


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_notification(request):

    try:

        data = json.loads(request.body)

        Notifications.objects.create(

            posted_by=data['posted_by'],

            category=data['category'],

            content=data['content'],

            priority=data['priority']
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):

    try:

        data = list(
            Notifications.objects.values()
        )

        return JsonResponse({
            "status": "Success",
            "data": data
        })

    except Exception as e:

        return JsonResponse({
            "status": "Error",
            "message": str(e)
        })


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