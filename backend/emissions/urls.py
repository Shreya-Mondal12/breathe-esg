from django.urls import path

from .views import (
    EmissionRecordListView,
    UpdateReviewStatusView
)

urlpatterns = [
    path('', EmissionRecordListView.as_view()),

    path(
        'review/<int:record_id>/',
        UpdateReviewStatusView.as_view()
    ),
]