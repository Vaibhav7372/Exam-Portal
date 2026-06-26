from rest_framework.routers import DefaultRouter
from .views import ResultViewSet

router = DefaultRouter()
router.register(
    r"results",
    ResultViewSet,
    basename="results"
)

urlpatterns = router.urls
