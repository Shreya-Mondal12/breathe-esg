from rest_framework import serializers


class CSVUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    source_type = serializers.CharField()
    company_id = serializers.IntegerField()