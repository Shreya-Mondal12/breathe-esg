from django.db import models
from companies.models import Company
from ingestion.models import RawRecord


class EmissionRecord(models.Model):

    SCOPE_CHOICES = [
        ("SCOPE_1", "Scope 1"),
        ("SCOPE_2", "Scope 2"),
        ("SCOPE_3", "Scope 3"),
    ]

    REVIEW_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("SUSPICIOUS", "Suspicious"),
    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE
    )

    raw_record = models.ForeignKey(
        RawRecord,
        on_delete=models.CASCADE
    )

    scope = models.CharField(
        max_length=20,
        choices=SCOPE_CHOICES
    )

    category = models.CharField(max_length=255)

    activity_type = models.CharField(max_length=255)

    quantity = models.FloatField()

    unit = models.CharField(max_length=50)

    normalized_unit = models.CharField(max_length=50)

    review_status = models.CharField(
        max_length=20,
        choices=REVIEW_CHOICES,
        default="PENDING"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    approved_by = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    approved_at = models.DateTimeField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.company.name} - {self.category}"