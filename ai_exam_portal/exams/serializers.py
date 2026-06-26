from rest_framework import serializers
from .models import Subject, Exam, Question

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        
class ExamSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    question_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Exam
        fields = [
            'id',
            'title',
            'subject',
            'duration',
            'total_marks',
            'question_count',
        ]
        
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id',
            'exam',
            'question_text',
            'question_type',
            'option_a',
            'option_b',
            'option_c',
            'option_d',
            'marks',
        ]


class ExamDetailSerializer(ExamSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta(ExamSerializer.Meta):
        fields = ExamSerializer.Meta.fields + ['questions']
