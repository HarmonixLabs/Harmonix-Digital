"""
GoHighLevel API Service for HARMONIX Platform
"""

import requests
import json
from datetime import datetime
from typing import Dict, List, Optional

class GoHighLevelService:
    """Service for interacting with GoHighLevel CRM API."""
    
    def __init__(self, api_key: str, base_url: str = "https://rest.gohighlevel.com/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def create_contact(self, contact_data: Dict) -> Dict:
        """Create a new contact in GoHighLevel."""
        try:
            endpoint = f"{self.base_url}/contacts"
            
            # Prepare contact payload
            payload = {
                "firstName": contact_data.get("firstName", ""),
                "lastName": contact_data.get("lastName", ""),
                "email": contact_data.get("email", ""),
                "phone": contact_data.get("phone", ""),
                "companyName": contact_data.get("companyName", ""),
                "tags": contact_data.get("tags", []),
                "customFields": contact_data.get("customFields", {}),
                "source": "harmonix-platform"
            }
            
            response = requests.post(
                endpoint,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                result = response.json()
                return {
                    "success": True,
                    "contact_id": result.get("contact", {}).get("id"),
                    "data": result
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "details": response.text
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def update_contact(self, contact_id: str, update_data: Dict) -> Dict:
        """Update an existing contact in GoHighLevel."""
        try:
            endpoint = f"{self.base_url}/contacts/{contact_id}"
            
            response = requests.put(
                endpoint,
                headers=self.headers,
                json=update_data,
                timeout=30
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "details": response.text
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def get_contact(self, contact_id: str) -> Dict:
        """Retrieve a contact from GoHighLevel."""
        try:
            endpoint = f"{self.base_url}/contacts/{contact_id}"
            
            response = requests.get(
                endpoint,
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "details": response.text
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def add_tags(self, contact_id: str, tags: List[str]) -> Dict:
        """Add tags to a contact."""
        try:
            endpoint = f"{self.base_url}/contacts/{contact_id}/tags"
            
            payload = {"tags": tags}
            
            response = requests.post(
                endpoint,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "details": response.text
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def create_opportunity(self, contact_id: str, opportunity_data: Dict) -> Dict:
        """Create an opportunity for a contact."""
        try:
            endpoint = f"{self.base_url}/opportunities"
            
            payload = {
                "contactId": contact_id,
                "title": opportunity_data.get("title", "HARMONIX Platform Interest"),
                "status": opportunity_data.get("status", "open"),
                "monetaryValue": opportunity_data.get("value", 0),
                "pipelineId": opportunity_data.get("pipelineId"),
                "stageId": opportunity_data.get("stageId"),
                "source": "harmonix-platform"
            }
            
            response = requests.post(
                endpoint,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                return {
                    "success": True,
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "details": response.text
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def trigger_workflow(self, contact_id: str, workflow_id: str) -> Dict:
        """Trigger a workflow for a contact."""
        try:
            endpoint = f"{self.base_url}/workflows/{workflow_id}/trigger"
            
            payload = {
                "contactId": contact_id,
                "eventData": {
                    "source": "harmonix-platform",
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
            
            response = requests.post(
                endpoint,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "details": response.text
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def search_contacts(self, query: str, limit: int = 20) -> Dict:
        """Search for contacts by email, phone, or name."""
        try:
            endpoint = f"{self.base_url}/contacts/search"
            
            params = {
                "query": query,
                "limit": limit
            }
            
            response = requests.get(
                endpoint,
                headers=self.headers,
                params=params,
                timeout=30
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "details": response.text
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def add_note(self, contact_id: str, note_content: str) -> Dict:
        """Add a note to a contact."""
        try:
            endpoint = f"{self.base_url}/contacts/{contact_id}/notes"
            
            payload = {
                "body": note_content,
                "userId": "harmonix-system"
            }
            
            response = requests.post(
                endpoint,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                return {
                    "success": True,
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "details": response.text
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def validate_api_key(self) -> Dict:
        """Validate the API key by making a simple request."""
        try:
            endpoint = f"{self.base_url}/locations"
            
            response = requests.get(
                endpoint,
                headers=self.headers,
                timeout=30
            )
            
            return {
                "success": response.status_code == 200,
                "status_code": response.status_code,
                "message": "API key is valid" if response.status_code == 200 else "API key is invalid"
            }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }