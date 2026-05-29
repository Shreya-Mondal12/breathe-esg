from django.db import models
from companies.models import Company


class DataSource(models.Model):
    SOURCE_CHOICES = [
        ("SAP", "SAP"),
        ("UTILITY", "UTILITY"),
        ("TRAVEL", "TRAVEL"),
    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE
    )

    source_type = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    uploaded_by = models.CharField(
        max_length=255,
        default="Analyst"
    )

    original_file_name = models.CharField(
        max_length=255,
        blank=True
    )

    uploaded_file = models.FileField(
    upload_to='uploads/',
    null=True,
    blank=True
)

    def __str__(self):
        return f"{self.company.name} - {self.source_type}"

class RawRecord(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "PENDING"),
        ("FAILED", "FAILED"),
        ("PROCESSED", "PROCESSED"),
    ]

    datasource = models.ForeignKey(
        DataSource,
        on_delete=models.CASCADE,
        related_name="raw_records"
    )

    raw_data = models.JSONField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    error_message = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"RawRecord {self.id}"