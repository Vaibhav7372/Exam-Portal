from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
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