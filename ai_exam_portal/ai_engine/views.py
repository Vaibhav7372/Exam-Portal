# views.py
from django.shortcuts import redirect
from django.conf import settings
from django.http import JsonResponse

def zoho_login(request):
    scope = "ZohoCRM.modules.ALL,ZohoCRM.settings.ALL"
    url = (
        f"{settings.ZOHO_ACCOUNTS_URL}/oauth/v2/auth"
        f"?scope={scope}"
        f"&client_id={settings.ZOHO_CLIENT_ID}"
        f"&response_type=code"
        f"&access_type=offline"
        f"&redirect_uri={settings.ZOHO_REDIRECT_URI}"
    )
    return redirect(url)

import requests
from django.utils import timezone
from datetime import timedelta
from .models import ZohoToken

def zoho_callback(request):
    code = request.GET.get('code')

    response = requests.post(f"{settings.ZOHO_ACCOUNTS_URL}/oauth/v2/token", data={
        "code": code,
        "client_id": settings.ZOHO_CLIENT_ID,
        "client_secret": settings.ZOHO_CLIENT_SECRET,
        "redirect_uri": settings.ZOHO_REDIRECT_URI,
        "grant_type": "authorization_code",
    })
    data = response.json()

    if "access_token" not in data:
        return JsonResponse({"error": data}, status=400)

    ZohoToken.objects.create(
        access_token=data["access_token"],
        refresh_token=data["refresh_token"],
        expires_at=timezone.now() + timedelta(seconds=data["expires_in"]),
    )
    return JsonResponse({"status": "connected successfully"})  

def refresh_zoho_token(token_obj):
    response = requests.post(f"{settings.ZOHO_ACCOUNTS_URL}/oauth/v2/token", data={
        "refresh_token": token_obj.refresh_token,
        "client_id": settings.ZOHO_CLIENT_ID,
        "client_secret": settings.ZOHO_CLIENT_SECRET,
        "grant_type": "refresh_token",
    })
    data = response.json()
    token_obj.access_token = data["access_token"]
    token_obj.expires_at = timezone.now() + timedelta(seconds=data["expires_in"])
    token_obj.save()
    return token_obj.access_token

def get_zoho_leads(request):
    token_obj = ZohoToken.objects.latest('id')

    if token_obj.expires_at <= timezone.now():
        access_token = refresh_zoho_token(token_obj)
    else:
        access_token = token_obj.access_token

    headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}
    
    params = {
        "fields": "Last_Name,First_Name,Email,Phone,Company"
    }
    
    resp = requests.get(
        f"{settings.ZOHO_API_DOMAIN}/crm/v3/Leads", 
        headers=headers,
        params=params
    )
    return JsonResponse(resp.json())    