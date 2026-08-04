from django.urls import path
from .views import DashboardView, PublicStatsView, RegisterAPIView

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('register/',RegisterAPIView.as_view(),name='register'),
    path('stats/', PublicStatsView.as_view(), name='public-stats'),
]
