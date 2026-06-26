from rest_framework.viewsets import ModelViewSet
from .models import Result
from .serializers import ResultSerializer
from rest_framework.permissions import IsAuthenticated

# class ResultListCreateView(ViewSet,ModelViewSet):
#     def get(self, request):
#         results = Result.objects.all()
#         serializer = ResultSerializer(results, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = ResultSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResultViewSet(ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        return Result.objects.filter(
            student=self.request.user
        ).select_related("student", "exam")
