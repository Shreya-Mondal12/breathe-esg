from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import AuditLog


@api_view(['GET'])
def audit_logs(request):

    logs = AuditLog.objects.all().order_by('-timestamp')

    data = []

    for log in logs:

        data.append({

            "id": log.id,

            "record_id": log.record.id,

            "action": log.action,

            "old_value": log.old_value,

            "new_value": log.new_value,

            "changed_by": log.changed_by,

            "changed_at": log.timestamp,
        })

    return Response(data)