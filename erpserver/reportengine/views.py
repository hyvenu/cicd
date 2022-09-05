from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.http import request

from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .service import ReportServices
from .serializers import ReportDataSerializer
from .models import ReportEngineModel

@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def get_report(request):
    data_id = request.query_params['id']
    from_date = request.query_params['from_date']
    to_date = request.query_params['to_date']
    services = ReportServices()
    report_data = services.get_report(data_id,from_date,to_date)
    return report_data

# @api_view(['GET'])
# @permission_classes([IsAuthenticated,])
# def get_report_data(request):
#     id = request.query_params['id']
#     report_data=ReportEngineModel.objects.filter(id=id).all()
#     report_data.delete()
#     data = {'status':'Success'}
#     return JsonResponse(data)

# @api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated,])
# def ReportFunctions(request):
#
#     snippet = ReportEngineModel.objects.all()
#     print(snippet)
#     if request.method == 'GET':
#         serializer = ReportDataSerializer()
#         print(serializer.data)
#         return Response(serializer.data)
#
#     elif request.method == 'PUT':
#         serializer = ReportDataSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     elif request.method == 'DELETE':
#         snippet.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
