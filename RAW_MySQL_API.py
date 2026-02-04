import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.db import connection
import UserDetails

@api_view(['POST'])
def user_register(request):
    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        phone = data.get("phone")
        role = data.get("role")
        created_by = data.get("created_by")
        updated_by = data.get("updated_by")

        # ---- Required Fields Check and Empty Fields Also Check ----
        required_fields = ["username","password","email","phone","role","created_by","updated_by"]
        missing_fields = [field for field in required_fields if not data.get(field) or data.get(field) == ""]

        if missing_fields:
            return JsonResponse(
                {"status": "error", "message": f"Missing fields: {', '.join(missing_fields)}"},
                status=400
            )

        # ---- User Role Validation Step ----
        valid_roles = ["ADMIN", "STAFF", "STUDENT"]
        if role.upper() not in valid_roles:
            return JsonResponse(
                {"status": "error", "message": "Invalid role. Use ADMIN / STAFF / STUDENT"},
                status=400
            )

        # ---- Check Unique Validation For Email & Phone Field ----
        if UserDetails.objects.filter(email=email).exists():
            return JsonResponse(
                {"status": "error", "message": "Email already exists"},
                status=400
            )

        if UserDetails.objects.filter(phone=phone).exists():
            return JsonResponse(
                {"status": "error", "message": "Phone already exists"},
                status=400
            )

        # ---- Inserted User Data Into Database ----
        with connection.cursor() as cursor:
            query = """
                INSERT INTO userdetails 
                (username, password, email, phone, role, created_by, updated_by, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            """
            cursor.execute(query, [username, password, email, phone, role, created_by, updated_by])

            last_id = cursor.lastrowid

            cursor.execute("""
                SELECT id, username, email, phone, role, created_by, updated_by, created_at, updated_at
                FROM userdetails
                WHERE id = %s
            """, [last_id])

            user = cursor.fetchone()
        
        # ---- Building Response Data ----
        response_data = {
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "phone": user[3],
            "role": user[4],
            "created_by": user[5],
            "updated_by": user[6],
            "created_at": user[7],
            "updated_at": user[8],
        }

        return JsonResponse({
            "status": "Success",
            "message": "User registered successfully",
            "data": response_data
        }, status=201)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@api_view(['GET'])
def get_particular_user(request):
    try:
        # ---- Read Request Body ----
        data = json.loads(request.body)
        user_id = data.get("used_id")

        # ---- Fetch User Data From Database ----
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, username, email, phone, role, created_by, updated_by, created_at, updated_at
                FROM userdetails
                WHERE id = %s
            """, [user_id])

            user = cursor.fetchone()

        # ---- If No Record Found ----
        if not user:
            return JsonResponse(
                {"status": "error", "message": "User not found"},
                status=404
            )

        # ---- Build Response ----
        user_data = {
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "phone": user[3],
            "role": user[4],
            "created_by": user[5],
            "updated_by": user[6],
            "created_at": user[7],
            "updated_at": user[8],
        }

        return JsonResponse({
            "status": "Success",
            "message": "User fetched successfully",
            "data": user_data
        }, status=200)

    except Exception as e:
        return JsonResponse(
            {"status": "error", "message": str(e)},
            status=500
        )
    
@api_view(['GET'])
def all_users(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, username, email, phone, role, created_by, updated_by, created_at, updated_at
                FROM userdetails
            """)

            rows = cursor.fetchall()

        # ---- Check If No Users Found - Empty Data ----
        if not rows:
            return JsonResponse(
                {"status": "error", "message": "No users found"},
                status=404
            )
        # ---- Creating a List For Appending a User ----
        users = []
        for user in rows:
            users.append({
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "phone": user[3],
                "role": user[4],
                "created_by": user[5],
                "updated_by": user[6],
                "created_at": user[7],
                "updated_at": user[8],
            })

        # Note : safe=False Used Because JsonResponse Returns List Data But Django Expects Dictionary
        # By Default safe=True -> When You Return A List Django Throws An Error So We Must Set safe=False
        return JsonResponse({
            "status": "Success",
            "message": "Users fetched successfully",
            "count": "Total users count is " + str(len(users)),
            "data": users
        }, safe=False, status=200)

    except Exception as e:
        return JsonResponse(
            {"status": "error", "message": str(e)},
            status=500
        )