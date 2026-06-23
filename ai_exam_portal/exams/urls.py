from rest_framework.routers import DefaultRouter
from rest_framework import routers
from .views import SubjectViewSet, ExamViewSet, QuestionViewSet
from .import views

router = routers.DefaultRouter()
router.register(r'subjects', views.SubjectViewSet)
router.register(r'exams', views.ExamViewSet)
router.register(r'questions', views.QuestionViewSet)

urlpatterns = router.urls