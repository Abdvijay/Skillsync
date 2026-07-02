from django.contrib import admin

from .models import StaffLeaveRequest, StudentLeaveRequest


@admin.register(StaffLeaveRequest)
class StaffLeaveRequestAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "staff",
        "leave_type",
        "start_date",
        "end_date",
        "status",
        "requested_at",
    ]

    search_fields = [
        "staff__username",
        "leave_type",
    ]

    list_filter = [
        "status",
        "leave_type",
    ]

@admin.register(StudentLeaveRequest)
class StudentLeaveRequestAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "student",
        "leave_type",
        "start_date",
        "end_date",
        "status",
        "requested_at",
    ]

    search_fields = [
        "student__username",
        "leave_type",
    ]

    list_filter = [
        "status",
        "leave_type",
    ]