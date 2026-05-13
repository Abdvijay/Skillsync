from django.db import models
from UserDetails.models import UserDetails

class Classes(models.Model):

    class_name = models.CharField(max_length=100)

    staff_name = models.CharField(max_length=100)

    availability = models.CharField(
        max_length=20,
        default="AVAILABLE"
    )

    assigned_date = models.DateField(
        null=True,
        blank=True
    )

    available_date = models.DateField(
        null=True,
        blank=True
    )

    created_by = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "classes"

    def __str__(self):
        return self.class_name


class StaffAssignments(models.Model):

    staff = models.ForeignKey(
        UserDetails,
        on_delete=models.CASCADE
    )

    class_name = models.CharField(
        max_length=100
    )

    class_time = models.CharField(
        max_length=100
    )

    class_start_date = models.DateField(null=True, blank=True)

    student_limit = models.IntegerField(default=50)

    class_status = models.CharField(max_length=20, default="OPEN")

    assigned_date = models.DateField(
        auto_now_add=True
    )

    assigned_by = models.CharField(
        max_length=100
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "staff_assignments"

    def __str__(self):

        return f"{self.staff.username} - {self.class_name}"