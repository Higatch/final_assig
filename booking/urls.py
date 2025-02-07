from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserRegisterView
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, me


router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("register/", UserRegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/users/me/", me, name="me"),
]
