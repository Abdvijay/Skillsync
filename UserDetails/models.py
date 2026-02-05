from django.db import models

class UserDetails(models.Model):

    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('STUDENT', 'Student'),
    ) # ('VALUE_STORED_IN_DATABASE', 'VALUE_DISPLAYED_TO_USER')

    username = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15,  unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    # Audit Fields
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=100,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True,null=True)

    class Meta:
        db_table = "userdetails"

    def __str__(self):
        return f"{self.username} ({self.role})"

class Course(models.Model):

    course_name = models.CharField(max_length=150) # Python full stack
    course_code = models.CharField(max_length=10, unique=True) # PFS

    description = models.TextField() # Python, HTML, CSS and etc.
    duration = models.CharField(max_length=50)   # e.g. "6 Months"

    created_by = models.CharField(max_length=100) # admin
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "courses"

    def __str__(self):
        return f"{self.course_name} ({self.course_code})"   