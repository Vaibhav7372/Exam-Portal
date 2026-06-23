from django.shortcuts import render
from rest_framework.views import APIView,ViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import Result
from .serializers import ResultSerializer, StudentAnswerSerializer

class ResultListCreateView(ViewSet,ModelViewSet):
    def get(self, request):
        results = Result.objects.all()
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
