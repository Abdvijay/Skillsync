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