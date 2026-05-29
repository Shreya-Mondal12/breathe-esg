from django.db import models
from emissions.models import EmissionRecord


class AuditLog(models.Model):

    ACTION_CHOICES = [
        ("CREATED", "Created"),
        ("UPDATED", "Updated"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    record = models.ForeignKey(
        EmissionRecord,
        on_delete=models.CASCADE
    )

    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES
    )

    changed_by = models.CharField(
        max_length=255
    )

    old_value = models.JSONField(
        blank=True,
        null=True
    )

    new_value = models.JSONField(
        blank=True,
        null=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} - {self.record.id}"