from django.contrib import admin
from django.urls import path, include
from reset_views import ResetDataView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/reset/', ResetDataView.as_view(), name='reset-data'),

    path('api/ingestion/', include('ingestion.urls')),
    path('api/emissions/', include('emissions.urls')),
    path('api/audit/', include('audit.urls')),
]