from django.urls import path
from .views import CSVUploadView
from .history_views import UploadHistoryView

urlpatterns = [
    path('upload/', CSVUploadView.as_view()),
    path('history/', UploadHistoryView.as_view()),
]