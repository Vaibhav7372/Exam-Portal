from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from exams.models import Exam, Subject
from .models import User
from .serializers import RegisterSerializer

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Welcome to AI Exam Portal",
            "user": request.user.username,
            "role": request.user.role
        })
        
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class PublicStatsView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({
            "exams": Exam.objects.count(),
            "students": User.objects.filter(role="student").count(),
            "courses": Subject.objects.count(),
            "satisfaction": 0,
        })
