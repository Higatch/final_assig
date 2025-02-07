from rest_framework import viewsets, generics, status, permissions
from .models import CustomUser, Course, Schedule, Reservation, Announcement
from .serializers import UserSerializer, CourseSerializer, ScheduleSerializer, ReservationSerializer, AnnouncementSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, BasePermission
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
            return Response({"error": "コースを編集はできません"}, status=403)

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsTeacher()]
        return [AllowAny()]

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = AnnouncementSerializer

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    premission_class = [AllowAny]
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "id": user.id,
                "username": user.username,
                "nickname": user.nickname,
                "is_teacher": user.is_teacher
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

@login_required
def me(request):
    user = request.user
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "nickname": user.nickname if hasattr(user, 'nickname') else None,
        "is_teacher": user.is_teacher if hasattr(user, 'is_teacher') else False
    })



class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_teacher
