from django.db import models

class Subject(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Exam(models.Model):
    title = models.CharField(max_length=200)
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE
    )
    duration = models.IntegerField(help_text="Minutes")
    total_marks = models.IntegerField(default=100)

    def __str__(self):
        return self.title
    
class Question(models.Model):
    QUESTION_TYPES = (
        ('mcq', 'MCQ'),
        ('text', 'Text Answer'),
    )

    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name='questions'
    )

    question_text = models.TextField()
    question_type = models.CharField(
        max_length=10,
        choices=QUESTION_TYPES,
        default='mcq'
    )

    option_a = models.CharField(max_length=255, blank=True)
    option_b = models.CharField(max_length=255, blank=True)
    option_c = models.CharField(max_length=255, blank=True)
    option_d = models.CharField(max_length=255, blank=True)

    correct_answer = models.TextField()

    marks = models.IntegerField(default=1)

    def __str__(self):
        return self.question_text[:50]