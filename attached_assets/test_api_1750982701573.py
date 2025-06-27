#!/usr/bin/env python3
"""
Test script for HARMONIX backend API endpoints.
This script tests all major functionality including registration, authentication, and external integrations.
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"
TEST_USER_EMAIL = "test@example.com"
TEST_USER_NAME = "Test User"
TEST_USER_PASSWORD = "TestPassword123!"

class HarmonixAPITester:
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        
    def log(self, message, status="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {status}: {message}")
    
    def test_health_check(self):
        """Test the health check endpoint."""
        self.log("Testing health check endpoint...")
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            if response.status_code == 200:
                data = response.json()
                self.log(f"Health check passed: {data['status']}", "SUCCESS")
                return True
            else:
                self.log(f"Health check failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"Health check error: {e}", "ERROR")
            return False
    
    def test_user_registration(self):
        """Test user registration endpoint."""
        self.log("Testing user registration...")
        
        registration_data = {
            "name": TEST_USER_NAME,
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "company": "Test Company Inc",
            "industry": "technology",
            "teamSize": "small",
            "acceptTerms": True,
            "marketingConsent": False
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json=registration_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                data = response.json()
                if data.get("success"):
                    self.auth_token = data["data"]["token"]
                    self.log(f"Registration successful for {TEST_USER_EMAIL}", "SUCCESS")
                    return True
                else:
                    self.log(f"Registration failed: {data.get('error', 'Unknown error')}", "ERROR")
                    return False
            else:
                self.log(f"Registration failed with status {response.status_code}: {response.text}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"Registration error: {e}", "ERROR")
            return False
    
    def test_user_login(self):
        """Test user login endpoint."""
        self.log("Testing user login...")
        
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.auth_token = data["data"]["token"]
                    self.log(f"Login successful for {TEST_USER_EMAIL}", "SUCCESS")
                    return True
                else:
                    self.log(f"Login failed: {data.get('error', 'Unknown error')}", "ERROR")
                    return False
            else:
                self.log(f"Login failed with status {response.status_code}: {response.text}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"Login error: {e}", "ERROR")
            return False
    
    def test_authenticated_endpoint(self):
        """Test an authenticated endpoint."""
        if not self.auth_token:
            self.log("No auth token available for authenticated test", "ERROR")
            return False
            
        self.log("Testing authenticated endpoint...")
        
        try:
            headers = {
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            }
            
            response = self.session.get(
                f"{self.base_url}/api/auth/me",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    user_data = data["data"]["user"]
                    self.log(f"Authenticated request successful for user: {user_data['email']}", "SUCCESS")
                    return True
                else:
                    self.log(f"Authenticated request failed: {data.get('error', 'Unknown error')}", "ERROR")
                    return False
            else:
                self.log(f"Authenticated request failed with status {response.status_code}: {response.text}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"Authenticated request error: {e}", "ERROR")
            return False
    
    def test_validation_errors(self):
        """Test validation error handling."""
        self.log("Testing validation error handling...")
        
        # Test with invalid email
        invalid_data = {
            "name": "",  # Empty name
            "email": "invalid-email",  # Invalid email format
            "password": "123",  # Too short password
            "acceptTerms": False  # Terms not accepted
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json=invalid_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 400:
                data = response.json()
                if not data.get("success") and data.get("error", {}).get("code") == "VALIDATION_ERROR":
                    self.log("Validation error handling working correctly", "SUCCESS")
                    return True
                else:
                    self.log(f"Unexpected validation response: {data}", "ERROR")
                    return False
            else:
                self.log(f"Expected 400 status for validation errors, got {response.status_code}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"Validation test error: {e}", "ERROR")
            return False
    
    def test_duplicate_registration(self):
        """Test duplicate email registration handling."""
        self.log("Testing duplicate email registration...")
        
        registration_data = {
            "name": "Another User",
            "email": TEST_USER_EMAIL,  # Same email as before
            "password": "AnotherPassword123!",
            "acceptTerms": True
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json=registration_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 400:
                data = response.json()
                if not data.get("success"):
                    self.log("Duplicate email handling working correctly", "SUCCESS")
                    return True
                else:
                    self.log(f"Unexpected duplicate email response: {data}", "ERROR")
                    return False
            else:
                self.log(f"Expected 400 status for duplicate email, got {response.status_code}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"Duplicate registration test error: {e}", "ERROR")
            return False
    
    def run_all_tests(self):
        """Run all tests and return summary."""
        self.log("Starting HARMONIX API tests...", "INFO")
        self.log("=" * 50, "INFO")
        
        tests = [
            ("Health Check", self.test_health_check),
            ("User Registration", self.test_user_registration),
            ("User Login", self.test_user_login),
            ("Authenticated Endpoint", self.test_authenticated_endpoint),
            ("Validation Errors", self.test_validation_errors),
            ("Duplicate Registration", self.test_duplicate_registration),
        ]
        
        results = {}
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            self.log(f"\n--- Running {test_name} ---")
            try:
                result = test_func()
                results[test_name] = result
                if result:
                    passed += 1
                time.sleep(1)  # Brief pause between tests
            except Exception as e:
                self.log(f"Test {test_name} crashed: {e}", "ERROR")
                results[test_name] = False
        
        # Print summary
        self.log("\n" + "=" * 50, "INFO")
        self.log("TEST SUMMARY", "INFO")
        self.log("=" * 50, "INFO")
        
        for test_name, result in results.items():
            status = "PASS" if result else "FAIL"
            self.log(f"{test_name}: {status}")
        
        self.log(f"\nOverall: {passed}/{total} tests passed", "INFO")
        
        if passed == total:
            self.log("All tests passed! 🎉", "SUCCESS")
        else:
            self.log(f"{total - passed} tests failed. Check logs above.", "ERROR")
        
        return passed == total

def main():
    """Main function to run the test suite."""
    print("HARMONIX Backend API Test Suite")
    print("=" * 40)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        if response.status_code != 200:
            print(f"❌ Server not responding properly at {BASE_URL}")
            print("Please make sure the backend server is running.")
            return False
    except requests.exceptions.RequestException:
        print(f"❌ Cannot connect to server at {BASE_URL}")
        print("Please make sure the backend server is running.")
        return False
    
    # Run tests
    tester = HarmonixAPITester()
    success = tester.run_all_tests()
    
    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)

