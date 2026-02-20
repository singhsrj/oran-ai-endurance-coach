"""
Direct API test - simulates what the frontend does
"""
import requests
import json

API_URL = "http://localhost:8000"

print("="*60)
print("Testing Oran AI Backend API")
print("="*60)

# Test 1: Health check
print("\n1. Testing /health endpoint...")
try:
    response = requests.get(f"{API_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 2: Login
print("\n2. Testing /login endpoint...")
login_data = {
    "email": "singhsrj553@gmail.com",
    "password": "1234@Qsx"
}

try:
    response = requests.post(
        f"{API_URL}/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Login successful!")
        print(f"   Token: {data['access_token'][:50]}...")
        token = data['access_token']
        
        # Test 3: Get profile
        print("\n3. Testing /me endpoint...")
        profile_response = requests.get(
            f"{API_URL}/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"   Status: {profile_response.status_code}")
        if profile_response.status_code == 200:
            print(f"   ✅ Profile retrieved!")
            print(f"   User: {profile_response.json()}")
        else:
            print(f"   ❌ Failed: {profile_response.text}")
    else:
        print(f"   ❌ Login failed!")
        print(f"   Response: {response.text}")
        
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "="*60)
print("If all tests pass, the backend is working correctly.")
print("The issue is likely in the frontend configuration.")
print("="*60)
