"""
API Testing Script for Module 1 (Auth & Database Core)
Run this script with: py test_api_module1.py (while backend server is running)
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_health():
    print("\n--- 1. Testing Health Check ---")
    res = requests.get(f"{BASE_URL}/api/health")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")
    assert res.status_code == 200

def test_register():
    print("\n--- 2. Testing User Registration ---")
    payload = {
        "email": "testuser@example.com",
        "full_name": "Test Engineer",
        "password": "Password123!",
        "target_role": "Senior Full Stack Engineer"
    }
    res = requests.post(f"{BASE_URL}/api/v1/auth/register", json=payload)
    print(f"Status Code: {res.status_code}")
    data = res.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    if res.status_code == 201:
        return data["access_token"]
    elif res.status_code == 400:
        print("User already exists. Proceeding to login...")
        return None

def test_login():
    print("\n--- 3. Testing User Login ---")
    payload = {
        "email": "testuser@example.com",
        "password": "Password123!"
    }
    res = requests.post(f"{BASE_URL}/api/v1/auth/login", json=payload)
    print(f"Status Code: {res.status_code}")
    data = res.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    assert res.status_code == 200
    return data["access_token"]

def test_get_me(token):
    print("\n--- 4. Testing Authenticated /me Profile Route ---")
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
    print(f"Status Code: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    assert res.status_code == 200

if __name__ == "__main__":
    try:
        test_health()
        token = test_register()
        if not token:
            token = test_login()
        test_get_me(token)
        print("\n[SUCCESS] ALL MODULE 1 API TESTS PASSED SUCCESSFULLY!")
    except Exception as e:
        print(f"\n[ERROR] Error during testing: {e}")
