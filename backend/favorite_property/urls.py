from django.urls import path
from .views import FavoritePropertyListView, FavoritePropertyByURLView, AddFavoriteProperty, FavoritePropertyDeleteView

urlpatterns = [
    path('', FavoritePropertyListView.as_view(), name='favorite-property'),
    path('add/', AddFavoriteProperty.as_view(), name='favorite-property'),
    path('by-url/', FavoritePropertyByURLView.as_view(), name='favorite-property-by-url'),
    path('favorites/<int:pk>/', FavoritePropertyDeleteView.as_view()),
]