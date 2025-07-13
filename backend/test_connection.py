
#!/usr/bin/env python3
"""
Test script to verify backend API endpoints
"""

import requests
import json
import sys
import time

BASE_URL = "http://localhost:5000/api"

def test_health():
    """Test if server is running"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print(f"❌ Server responded with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to server: {e}")
        return False

def test_login():
    """Test login endpoint with all demo users"""
    demo_users = [
        {"email": "admin@zapcg.com", "password": "admin123", "role": "Administrator"},
        {"email": "finance@zapcg.com", "password": "finance123", "role": "Finance Head"},
        {"email": "hr@zapcg.com", "password": "hr123", "role": "HR Manager"},
        {"email": "manager@zapcg.com", "password": "manager123", "role": "Resource Manager"},
        {"email": "delivery@zapcg.com", "password": "delivery123", "role": "Delivery Owner"}
    ]
    
    all_passed = True
    
    for user in demo_users:
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login", 
                json={"email": user["email"], "password": user["password"]},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ {user['role']}: {user['email']}")
            else:
                print(f"❌ {user['role']}: {user['email']} - Status: {response.status_code}")
                all_passed = False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ {user['role']}: {user['email']} - Error: {e}")
            all_passed = False
    
    return all_passed

def main():
    """Run all tests"""
    print("🧪 Testing Backend API Connection...")
    print("-" * 50)
    
    # Test server health
    if not test_health():
        print("\n💡 Start the Flask server:")
        print("   cd backend")
        print("   python start_dev_server.py")
        print("\n   Or use the existing script:")
        print("   python start_server.py")
        sys.exit(1)
    
    # Wait a moment for server to fully initialize
    time.sleep(1)
    
    # Test login for all users
    print("\n🔐 Testing Demo User Login...")
    if not test_login():
        print("\n💡 Some users failed to login. Check:")
        print("   - Database initialization")
        print("   - User creation in UserService.create_default_users()")
        sys.exit(1)
    
    print("\n🎉 All tests passed! Backend is ready.")
    print("\n🌐 Backend: http://localhost:5000")
    print("📱 Frontend: http://localhost:5173")

if __name__ == "__main__":
    main()
