from django.urls import path
from .views import UserCreditsView

urlpatterns = [
    path('', UserCreditsView.as_view(), name='user-credits'),
]
