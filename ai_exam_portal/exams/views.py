from django.shortcuts import render
from .models import Subject, Exam, Question
from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import SubjectSerializer, ExamSerializer, QuestionSerializer, ExamDetailSerializer
from results.models import Result, StudentAnswer
from results.serializers import ResultSerializer


def normalize_answer(value):
    return str(value or '').strip().lower()


def is_correct_answer(question, submitted_answer):
    submitted = normalize_answer(submitted_answer)
    correct = normalize_answer(question.correct_answer)

    option_values = {
        'a': question.option_a,
        'b': question.option_b,
        'c': question.option_c,
        'd': question.option_d,
        'option_a': question.option_a,
        'option_b': question.option_b,
        'option_c': question.option_c,
        'option_d': question.option_d,
    }

    accepted_answers = {correct}
    if correct in option_values:
        accepted_answers.add(normalize_answer(option_values[correct]))

    return submitted in accepted_answers


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    
class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().select_related('subject').prefetch_related('questions')
    serializer_class = ExamSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ExamDetailSerializer
        return ExamSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        exam = self.get_object()
        answers = request.data.get('answers', {})

        if not isinstance(answers, dict):
            return Response(
                {'detail': 'Answers must be an object keyed by question id.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        questions = list(exam.questions.all())
        if not questions:
            return Response(
                {'detail': 'This exam has no questions yet.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total_marks = sum(question.marks for question in questions)
        obtained_marks = 0
        answer_rows = []

        with transaction.atomic():
            StudentAnswer.objects.filter(
                student=request.user,
                question__exam=exam,
            ).delete()
            Result.objects.filter(
                student=request.user,
                exam=exam,
            ).delete()

            for question in questions:
                submitted_answer = str(answers.get(str(question.id), '')).strip()
                is_correct = is_correct_answer(question, submitted_answer)
                marks_obtained = question.marks if is_correct else 0
                obtained_marks += marks_obtained

                answer_rows.append(StudentAnswer(
                    student=request.user,
                    question=question,
                    answer=submitted_answer,
                    is_correct=is_correct,
                    marks_obtained=marks_obtained,
                ))

            StudentAnswer.objects.bulk_create(answer_rows)
            result = Result.objects.create(
                student=request.user,
                exam=exam,
                total_marks=total_marks,
                obtained_marks=obtained_marks,
                percentage=(obtained_marks / total_marks * 100) if total_marks else 0,
            )

        return Response(ResultSerializer(result).data, status=status.HTTP_201_CREATED)
    
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
