from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CourseViewSet, ScheduleViewSet, ReservationViewSet, AnnouncementViewSet, UserRegisterView, CustomTokenObtainPairView, me
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView


router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'reservations', ReservationViewSet)
router.register(r'announcements', AnnouncementViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/users/me/", me, name="me"),
]
