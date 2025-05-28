# credits/utils.py
from .models import CreditWallet, CreditTransaction

def deduct_credits(user, amount, reason):
    wallet = CreditWallet.objects.get(user=user)
    if wallet.total_credits < amount:
        raise ValueError("Not enough credits")
    wallet.total_credits -= amount
    wallet.save()
    CreditTransaction.objects.create(
        user=user,
        amount=amount,
        reason=reason,
        transaction_type='deduct'
    )

def add_credits(user, amount, reason):
    wallet = CreditWallet.objects.get(user=user)
    wallet.total_credits += amount
    wallet.save()
    CreditTransaction.objects.create(
        user=user,
        amount=amount,
        reason=reason,
        transaction_type='add'
    )
