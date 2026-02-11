import json
from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserDetails
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

@api_view(['POST'])
def user_register(request):
    try:
        data = json.loads(request.body)
        reg_obj = UserDetails.objects.create(
            username=data['username'],
            password=data['password'],
            email=data['email'],
            phone=data['phone'],
            role=data['role'],
            created_by=data['created_by']
        )

        # ✅ ALSO Create Django User
        User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )

        return JsonResponse({
            "status": "Success",
            "message": "Data Inserted Successfully",
            "data": {
                "Id": reg_obj.id,
                "Username": reg_obj.username,
                "Email": reg_obj.email,
                "Phone": reg_obj.phone,
                "Role": reg_obj.role,
                "Created_by": reg_obj.created_by,
                "Updated_by": reg_obj.updated_by,
                "Created_at": reg_obj.created_at,
                "Updated_at": reg_obj.updated_at,
            }
        }, status=201)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_particular_user(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            obj = UserDetails.objects.get(id=data['id'])

            # http://127.0.0.1:8000/get_particular_user/?id=2
            # Id = request.GET.get('id')
            # obj = UserDetails.objects.get(id=Id)
            # print(obj)

            return JsonResponse({
                "status" : "Success",
                "message" : "Data fetched successfully",
                "data" : {
                    "Id" : obj.id,
                    "Username": obj.username,
                    "Email" : obj.email,
                    "Phone" : obj.phone,
                    "Role" : obj.role,
                    "Created_by" : obj.created_by,
                    "Updated_by" : obj.updated_by,
                    "Created_date" : obj.created_at,
                    "Updated_date" : obj.updated_at
                }
            })
        except Exception as e:
            return JsonResponse({
                "status" : "Error",
                "message" : str(e)
            })
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    
    # Without using all() because all returns model obj so we can use values() and convert it into list
    if request.method == "GET":
        try:
            data = list(UserDetails.objects.values())
            if not data:
                return JsonResponse({
                    "status" : "Success",
                    "message" : "No records Found !"
                })
            
            return JsonResponse({
                "status" : "Success",
                "message" : "Records found successfully",
                "count" : len(data),
                "data" : data
            })

        except Exception as e:
            return JsonResponse({
                "status" : "Error",
                "message" : str(e)
            })

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request):
    try:
        data = json.loads(request.body)
        user_id = data.get('id')
        if not user_id:
            return JsonResponse({"status": "Error", "message": "id is required"}, status=400)

        obj = UserDetails.objects.get(id=user_id)

        # Update only provided fields
        if 'username' in data:
            obj.username = data['username']
        if 'password' in data:
            obj.password = data['password']
        if 'email' in data:
            obj.email = data['email']
        if 'phone' in data:
            obj.phone = data['phone']
        if 'role' in data:
            obj.role = data['role']

        obj.updated_by = obj.username
        obj.save()

        return JsonResponse({
            "status": "Success",
            "message": "User updated successfully",
            "data": {
                "Id": obj.id,
                "Username": obj.username,
                "Email": obj.email,
                "Phone": obj.phone,
                "Role": obj.role,
                "Created_by": obj.created_by,
                "Updated_by": obj.updated_by,
                "Created_at": obj.created_at,
                "Updated_at": obj.updated_at,
            }
        })

    except UserDetails.DoesNotExist:
        return JsonResponse({"status": "Error", "message": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "Error", "message": str(e)}, status=500)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    try:
        data = json.loads(request.body)
        user_id = data.get('id')
        if not user_id:
            return JsonResponse({"status": "Error", "message": "id is required"}, status=400)

        obj = UserDetails.objects.get(id=user_id)
        obj.delete()

        return JsonResponse({
            "status": "Success",
            "message": "User deleted successfully",
            "deleted_id": user_id
        })
    except UserDetails.DoesNotExist:
        return JsonResponse({"status": "Error", "message": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "Error", "message": str(e)}, status=500)

@api_view(['POST'])
def login_user(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse(
                {"status": "Error", "message": "email and password are required"},
                status=400
            )

        obj = UserDetails.objects.get(email=email, password=password)

        user = User.objects.get(email=email)
        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            "status": "Success",
            "message": "Login successful",
            "data": {
                "Id": obj.id,
                "Username": obj.username,
                "Email": obj.email,
                "Phone": obj.phone,
                "Role": obj.role
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })

    except UserDetails.DoesNotExist:
        return JsonResponse(
            {"status": "Error", "message": "Invalid credentials"},
            status=401
        )

    except Exception as e:
        return JsonResponse(
            {"status": "Error", "message": str(e)},
            status=500
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_user(request):
    try:
        username = request.GET.get('username')
        role = request.GET.get('role')

        qs = UserDetails.objects.all()
        if username: # http://127.0.0.1:8000/search_user/?username=ij
            qs = qs.filter(username__icontains=username)

        if role: # http://127.0.0.1:8000/search_user/?role=staff
            qs = qs.filter(role=role)

        data = list(qs.values())
        if not data:
            return JsonResponse({
                "status": "Success",
                "message": "No records Found !",
                "count": 0,
                "data": []
            })

        return JsonResponse({
            "status": "Success",
            "message": "Records found successfully",
            "count": len(data),
            "data": data
        })
    except Exception as e:
        return JsonResponse({"status": "Error", "message": str(e)}, status=500)