from django.contrib import admin

from .models import StaffLeaveRequest


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