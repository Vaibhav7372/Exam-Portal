from django.db import models
from accounts.models import User
from exams.models import Exam, Question


class StudentAnswer(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE
    )

    answer = models.TextField()

    is_correct = models.BooleanField(
        default=False
    )

    marks_obtained = models.FloatField(
        default=0
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.student.username} - {self.question.id}"


class Result(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE
    )

    total_marks = models.FloatField()
    obtained_marks = models.FloatField()

    percentage = models.FloatField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.student.username} - {self.exam.title}"