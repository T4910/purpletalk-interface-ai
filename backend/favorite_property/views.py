from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import FavoriteProperty
from rest_framework import generics
from rest_framework.views import APIView
from .serializers import FavoritePropertySerializer
from .models import PropertySnapshot
from django_q.models import Schedule
from .utils import extract_listing_data_sync
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime


class FavoritePropertyListView(generics.ListAPIView):
    serializer_class = FavoritePropertySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return FavoriteProperty.objects.filter(user=self.request.user).order_by(
            "-added_at"
        )

    def perform_destroy(self, instance):
        Schedule.objects.filter(
            name=f"price_check_user_{instance.user.id}_{instance.property.id}"
        ).delete()
        instance.delete()


class AddFavoriteProperty(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        url = request.query_params.get("details_url")
        if not url:
            return Response(
                {"error": "Missing `details_url` query parameter."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Extract listing data from the provided URL
            # listing_data_list = extract_listing_data_sync('https://nigeriapropertycentre.com/for-sale/houses/semi-detached-duplexes/lagos/ajah/sangotedo/2595961-luxury-5-bedrooms-semi-detached-duplex')
            listing_data_list = extract_listing_data_sync(url)

            if not listing_data_list:
                return Response(
                    {
                        "success": False,
                        "error": "No listings found for the provided URL.",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            listing_data = listing_data_list[0]

            try:
                parsed_listing_date = (
                    datetime.strptime(listing_data.listing, "%d %b %Y")
                    if listing_data.listing
                    else None
                )
            except ValueError:
                parsed_listing_date = None  # fallback if format is wrong

            # Get or create a snapshot
            property_snapshot, _ = PropertySnapshot.objects.get_or_create(
                details_url=listing_data.details_url,
                defaults={
                    "location": listing_data.location,
                    "image_url": listing_data.image_url,
                    "title": listing_data.title,
                    "description": listing_data.description,
                    "bedroom": listing_data.bedroom,
                    "bathroom": listing_data.bathrooms,
                    "listing_time": parsed_listing_date,
                    "amenities": listing_data.amenities,
                    "property_type": listing_data.property_type,
                    "contact": listing_data.phonenumber,
                    "price": listing_data.price,
                    "extra_data": listing_data.model_dump(),  # Save all data as fallback
                    "initiator": "user",
                },
            )

            # Favorite for this user
            favorite, created = FavoriteProperty.objects.get_or_create(
                user=request.user, property=property_snapshot
            )

            return Response(
                {"success": True, "created": created, "favorite_id": favorite.id},
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"success": False, "error": f"Failed to process URL ({url}): {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Schedule.objects.create(ks
        #     func='favorite_property.tasks.check_favorite_prices',
        #     args=str(favorite.user.id),
        #     name=f'price_check_user_{favorite.user.id}_{favorite.property.id}',
        #     schedule_type=Schedule.HOURLY,
        #     minutes=favorite.check_interval_hours * 60,
        #     repeats=-1
        # )


# /favorites/by-url/?url=https://...
class FavoritePropertyByURLView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        url = request.query_params.get("details_url")
        if not url:
            return Response(
                {"error": "URL is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            favorite = FavoriteProperty.objects.get(
                user=request.user, property__details_url=url
            )
            serializer = FavoritePropertySerializer(favorite)
            return Response(serializer.data)
        except FavoriteProperty.DoesNotExist:
            return Response(
                {"error": "Favorite not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request):
        url = request.query_params.get("details_url")
        if not url:
            return Response(
                {"error": "URL is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            favorite = FavoriteProperty.objects.get(
                user=request.user, property__details_url=url
            )
            # Delete the associated schedule (if any)
            Schedule.objects.filter(
                name=f"price_check_user_{favorite.user.id}_{favorite.property.id}"
            ).delete()
            favorite.delete()
            return Response(
                {"success": True, "message": "Favorite deleted"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except FavoriteProperty.DoesNotExist:
            return Response(
                {"error": "Favorite not found"}, status=status.HTTP_404_NOT_FOUND
            )


class FavoritePropertyDeleteView(generics.DestroyAPIView):
    serializer_class = FavoritePropertySerializer
    permission_classes = (IsAuthenticated,)

    def perform_destroy(self, instance):
        Schedule.objects.filter(
            name=f"price_check_user_{instance.user.id}_{instance.property.id}"
        ).delete()
        instance.delete()
