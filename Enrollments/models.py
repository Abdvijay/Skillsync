from django.db import models
from UserDetails.models import UserDetails
from Classes.models import StaffAssignments


class StudentEnrollment(models.Model):

    ENROLLMENT_STATUS = [

        ("ACTIVE", "ACTIVE"),

        ("COMPLETED", "COMPLETED"),

        ("DROPPED", "DROPPED"),

    ]

    student = models.ForeignKey(
        UserDetails,
        on_delete=models.CASCADE,
        related_name="student_enrollments"
    )

    assigned_class = models.ForeignKey(
        StaffAssignments,
        on_delete=models.CASCADE,
        related_name="class_enrollments"
    )

    enrollment_status = models.CharField(
        max_length=20,
        choices=ENROLLMENT_STATUS,
        default="ACTIVE"
    )

    enrolled_date = models.DateTimeField(
        auto_now_add=True
    )

    enrolled_by = models.ForeignKey(
        UserDetails,
        on_delete=models.SET_NULL,
        null=True,
        related_name="enrolled_students"
    )

    class Meta:

        db_table = "student_enrollments"

    def __str__(self):

        return (
            f"{self.student.username}"
            f" - "
            f"{self.assigned_class.class_name}"
        )