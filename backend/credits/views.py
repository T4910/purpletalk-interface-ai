from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CreditWallet

# Create your views here.
class UserCreditsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = CreditWallet.objects.get(user=request.user)
        return Response({"credits": wallet.total_credits})