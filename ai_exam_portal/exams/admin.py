from django.contrib import admin
from .models import Subject, Exam, Question

admin.site.register(Subject)
admin.site.register(Exam)
admin.site.register(Question)