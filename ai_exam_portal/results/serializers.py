
from.models import Result, StudentAnswer
from rest_framework import serializers 


class ResultSerializer(serializers.ModelSerializer):
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Result
        fields = [
            'id',
            'student',
            'student_username',
            'exam',
            'exam_title',
            'total_marks',
            'obtained_marks',
            'percentage',
            'created_at',
        ]
        
class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = '__all__'
        
        
