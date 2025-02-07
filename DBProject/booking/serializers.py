from rest_framework import serializers
from .models import CustomUser, Course, Schedule, Reservation, Announcement
from django.contrib.auth import get_user_model
from booking.models import CustomUser
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'nickname', 'is_teacher', 'password', 'password_confirm')
        extra_kwargs = {'password': {'write_only': True}}
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "パスワードが一致しません。"})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            nickname=validated_data['nickname'],
            is_teacher=validated_data.get('is_teacher', False),
            password=validated_data['password']
        )
        return user

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    teacher_name = serializers.ReadOnlyField(source='teacher.username')

    class Meta:
        model = Schedule
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
