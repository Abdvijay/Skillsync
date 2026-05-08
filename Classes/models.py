from django.db import models

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