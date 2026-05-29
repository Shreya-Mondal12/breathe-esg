from rest_framework.views import APIView
from rest_framework.response import Response

from .models import EmissionRecord
from audit.models import AuditLog


class EmissionRecordListView(APIView):

    def get(self, request):

        records = EmissionRecord.objects.all()

        data = []

        for record in records:

            data.append({
                "id": record.id,
                "company": record.company.name,
                "scope": record.scope,
                "category": record.category,
                "activity_type": record.activity_type,
                "quantity": record.quantity,
                "unit": record.unit,
                "normalized_unit": record.normalized_unit,
                "review_status": record.review_status,
            })

        return Response(data)


class UpdateReviewStatusView(APIView):

    def post(self, request, record_id):

        try:

            record = EmissionRecord.objects.get(id=record_id)

            # =========================================
            # LOCK FINALIZED RECORDS
            # =========================================

            if record.review_status in [
                "APPROVED",
                "REJECTED"
            ]:

                return Response({
                    "error": "Finalized records cannot be modified"
                }, status=400)

            new_status = request.data.get("status")

            old_status = record.review_status

            # =========================================
            # UPDATE STATUS
            # =========================================

            record.review_status = new_status
            record.save()

            # =========================================
            # CREATE AUDIT LOG
            # =========================================

            AuditLog.objects.create(
                record=record,
                action="UPDATED",
                changed_by="Analyst",
                old_value={
                    "review_status": old_status
                },
                new_value={
                    "review_status": new_status
                }
            )

            return Response({
                "message": "Status updated successfully"
            })

        except EmissionRecord.DoesNotExist:

            return Response({
                "error": "Record not found"
            }, status=404)

        except Exception as e:

            return Response({
                "error": str(e)
            }, status=500)