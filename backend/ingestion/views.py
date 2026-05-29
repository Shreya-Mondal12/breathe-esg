from rest_framework.views import APIView
from rest_framework.response import Response

from .services import process_file


class CSVUploadView(APIView):

    def post(self, request):

        try:

            file = request.FILES.get('file')

            source_type = request.data.get(
                'source_type'
            )

            company_id = request.data.get(
                'company_id'
            )

            created_records = process_file(
                file,
                source_type,
                company_id
            )

           
            return Response({
                "message": "CSV processed successfully",
                "records_created": created_records
            })

        except Exception as e:

            print(e)

            raise e

