from django.db import models

class Notifications(models.Model):

    posted_by = models.CharField(
        max_length=100
    )

    category = models.CharField(
        max_length=100
    )

    content = models.TextField()

    extra_data = models.JSONField(default=dict)

    priority = models.CharField(
        max_length=20,
        default="Normal"
    )

    edited = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        db_table = "notifications"

        ordering = ['-created_at']

    def __str__(self):

        return self.category