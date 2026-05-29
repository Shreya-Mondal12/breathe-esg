from rest_framework.views import APIView
from rest_framework.response import Response

from .models import DataSource


class UploadHistoryView(APIView):

    def get(self, request):

        uploads = DataSource.objects.all().order_by(
            '-uploaded_at'
        )

        data = []

        for upload in uploads:

            data.append({
                "id": upload.id,
                "file_name": upload.original_file_name,
                "source_type": upload.source_type,
                "uploaded_at": upload.uploaded_at,
            })

        return Response(data)