from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.http import Http404
from rest_framework.views import APIView
from rest_framework import status
from django.http import request

from . import serializers
from . import models


class ReportListViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = models.ReportEngineModel.objects.all()

    def get_serializer_class(request):
        if request.request.method == 'GET':
            serializer_class = serializers.ReportDataSerializer2
        else:
            serializer_class = serializers.ReportDataSerializer
        return serializer_class


# class SnippetDetail(APIView):
#     """
#     Retrieve, update or delete a snippet instance.
#     """
#     def get(self):
#         snippet = models.ReportEngineModel.objects.all()
#         serializer = serializers.ReportDataSerializer(snippet)
#         return Response(serializer.data)
#
#     def put(self, request):
#         snippet = models.ReportEngineModel.objects.all()
#         serializer = serializers.ReportDataSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReportListViewSet2(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = models.ReportEngineModel.objects.all()

    def get_serializer_class(request):
        if request.request.method == 'GET':
            serializer_class = serializers.ReportDataSerializer2
        else:
            serializer_class = serializers.ReportDataSerializer
        return serializer_class
