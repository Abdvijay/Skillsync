from django.db import models

from UserDetails.models import UserDetails


class StaffLeaveRequest(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "PENDING"),
        ("APPROVED", "APPROVED"),
        ("REJECTED", "REJECTED"),
    ]

    LEAVE_TYPE_CHOICES = [
        ("SICK", "SICK"),
        ("CASUAL", "CASUAL"),
        ("PERSONAL", "PERSONAL"),
        ("EMERGENCY", "EMERGENCY"),
        ("OTHER", "OTHER"),
    ]

    staff = models.ForeignKey(
        UserDetails,
        on_delete=models.CASCADE
    )

    leave_type = models.CharField(
        max_length=30,
        choices=LEAVE_TYPE_CHOICES
    )

    start_date = models.DateField()

    end_date = models.DateField()

    total_days = models.IntegerField(default=1)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    admin_remarks = models.TextField(
        blank=True,
        null=True
    )

    requested_at = models.DateTimeField(
        auto_now_add=True
    )

    reviewed_at = models.DateTimeField(
        blank=True,
        null=True
    )

    reviewed_by = models.ForeignKey(
        UserDetails,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_leave_requests"
    )

    def __str__(self):

        return (
            f"{self.staff.username} - "
            f"{self.leave_type}"
        )