from rest_framework.views import APIView
from rest_framework.response import Response

from audit.models import AuditLog
from emissions.models import EmissionRecord
from ingestion.models import RawRecord
from ingestion.models import DataSource


class ResetDataView(APIView):

    def post(self, request):

        # DELETE IN CORRECT ORDER

        AuditLog.objects.all().delete()

        EmissionRecord.objects.all().delete()

        RawRecord.objects.all().delete()

        DataSource.objects.all().delete()

        return Response({
            "message": "All data reset successfully"
        })