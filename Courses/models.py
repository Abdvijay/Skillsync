from django.db import models

class Courses(models.Model):

    course_name = models.CharField(max_length=150)
    course_code = models.CharField(max_length=10, unique=True)

    description = models.TextField()
    duration = models.CharField(max_length=50)

    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "courses"

    def __str__(self):
        return f"{self.course_name} ({self.course_code})"