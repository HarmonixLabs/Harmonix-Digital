import requests
import time
from flask import current_app
from src.models.user import db, ExternalSyncLog
from datetime import datetime

class GHLService:
    """GoHighLevel CRM integration service"""
    
    def __init__(self):
        self.api_key = current_app.config.get('GHL_API_KEY')
        self.base_url = 'https://rest.gohighlevel.com/v1'
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        self.rate_limit_delay = 1  # 1 second between requests
        self.last_request_time = 0
    
    def _rate_limit(self):
        """Implement rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - time_since_last)
        self.last_request_time = time.time()
    
    def _make_request(self, method, endpoint, data=None, user_id=None, operation=None):
        """Make API request with error handling and logging"""
        self._rate_limit()
        
        url = f"{self.base_url}{endpoint}"
        sync_log = None
        
        try:
            # Create sync log entry
            if user_id and operation:
                sync_log = ExternalSyncLog(
                    user_id=user_id,
                    system_name='ghl',
                    operation=operation,
                    request_data=data,
                    status='pending'
                )
                db.session.add(sync_log)
                db.session.commit()
            
            # Make request
            if method.upper() == 'GET':
                response = requests.get(url, headers=self.headers, timeout=30)
            elif method.upper() == 'POST':
                response = requests.post(url, headers=self.headers, json=data, timeout=30)
            elif method.upper() == 'PUT':
                response = requests.put(url, headers=self.headers, json=data, timeout=30)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=self.headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            # Process response
            response_data = response.json() if response.content else {}
            
            if response.status_code in [200, 201]:
                # Success
                if sync_log:
                    sync_log.status = 'success'
                    sync_log.response_data = response_data
                    sync_log.completed_at = datetime.utcnow()
                    db.session.commit()
                
                return {
                    'success': True,
                    'data': response_data,
                    'status_code': response.status_code
                }
            else:
                # Error
                error_message = response_data.get('message', f'HTTP {response.status_code}')
                
                if sync_log:
                    sync_log.status = 'failed'
                    sync_log.error_message = error_message
                    sync_log.response_data = response_data
                    sync_log.completed_at = datetime.utcnow()
                    db.session.commit()
                
                return {
                    'success': False,
                    'error': error_message,
                    'status_code': response.status_code,
                    'data': response_data
                }
        
        except requests.exceptions.Timeout:
            error_message = 'Request timeout'
            if sync_log:
                sync_log.status = 'failed'
                sync_log.error_message = error_message
                sync_log.completed_at = datetime.utcnow()
                db.session.commit()
            
            return {
                'success': False,
                'error': error_message,
                'retry': True
            }
        
        except requests.exceptions.ConnectionError:
            error_message = 'Connection error'
            if sync_log:
                sync_log.status = 'failed'
                sync_log.error_message = error_message
                sync_log.completed_at = datetime.utcnow()
                db.session.commit()
            
            return {
                'success': False,
                'error': error_message,
                'retry': True
            }
        
        except Exception as e:
            error_message = f'Unexpected error: {str(e)}'
            current_app.logger.error(f"GHL API error: {e}")
            
            if sync_log:
                sync_log.status = 'failed'
                sync_log.error_message = error_message
                sync_log.completed_at = datetime.utcnow()
                db.session.commit()
            
            return {
                'success': False,
                'error': error_message
            }
    
    def create_contact(self, contact_data, user_id=None):
        """Create a new contact in GoHighLevel"""
        try:
            # Prepare contact data for GHL API
            ghl_data = {
                'firstName': contact_data.get('name', '').split(' ')[0] if contact_data.get('name') else '',
                'lastName': ' '.join(contact_data.get('name', '').split(' ')[1:]) if contact_data.get('name') and len(contact_data.get('name', '').split(' ')) > 1 else '',
                'email': contact_data.get('email', ''),
                'phone': contact_data.get('phone', ''),
                'companyName': contact_data.get('company', ''),
                'customFields': {
                    'industry': contact_data.get('industry', ''),
                    'team_size': contact_data.get('team_size', ''),
                    'source': contact_data.get('source', 'harmonix_platform'),
                    'signup_date': datetime.utcnow().isoformat()
                }
            }
            
            # Remove empty fields
            ghl_data = {k: v for k, v in ghl_data.items() if v}
            if 'customFields' in ghl_data:
                ghl_data['customFields'] = {k: v for k, v in ghl_data['customFields'].items() if v}
            
            result = self._make_request(
                'POST',
                '/contacts',
                ghl_data,
                user_id,
                'create_contact'
            )
            
            if result['success']:
                contact_id = result['data'].get('contact', {}).get('id')
                return {
                    'success': True,
                    'contact_id': contact_id,
                    'data': result['data']
                }
            else:
                return {
                    'success': False,
                    'error': result['error']
                }
        
        except Exception as e:
            current_app.logger.error(f"Create contact error: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def tag_contact(self, contact_id, tags, user_id=None):
        """Apply tags to a contact"""
        try:
            if not isinstance(tags, list):
                tags = [tags]
            
            tag_data = {
                'tags': tags
            }
            
            result = self._make_request(
                'POST',
                f'/contacts/{contact_id}/tags',
                tag_data,
                user_id,
                'tag_contact'
            )
            
            if result['success']:
                return {
                    'success': True,
                    'applied_tags': tags,
                    'data': result['data']
                }
            else:
                return {
                    'success': False,
                    'error': result['error']
                }
        
        except Exception as e:
            current_app.logger.error(f"Tag contact error: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def update_contact(self, contact_id, update_data, user_id=None):
        """Update contact information"""
        try:
            # Prepare update data for GHL API
            ghl_data = {}
            
            if 'name' in update_data:
                name_parts = update_data['name'].split(' ', 1)
                ghl_data['firstName'] = name_parts[0]
                if len(name_parts) > 1:
                    ghl_data['lastName'] = name_parts[1]
            
            if 'email' in update_data:
                ghl_data['email'] = update_data['email']
            
            if 'phone' in update_data:
                ghl_data['phone'] = update_data['phone']
            
            if 'company' in update_data:
                ghl_data['companyName'] = update_data['company']
            
            # Handle custom fields
            custom_fields = {}
            for field in ['industry', 'team_size', 'status']:
                if field in update_data:
                    custom_fields[field] = update_data[field]
            
            if custom_fields:
                ghl_data['customFields'] = custom_fields
            
            result = self._make_request(
                'PUT',
                f'/contacts/{contact_id}',
                ghl_data,
                user_id,
                'update_contact'
            )
            
            if result['success']:
                return {
                    'success': True,
                    'updated_fields': list(ghl_data.keys()),
                    'data': result['data']
                }
            else:
                return {
                    'success': False,
                    'error': result['error']
                }
        
        except Exception as e:
            current_app.logger.error(f"Update contact error: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_contact(self, contact_id, user_id=None):
        """Retrieve contact information"""
        try:
            result = self._make_request(
                'GET',
                f'/contacts/{contact_id}',
                None,
                user_id,
                'get_contact'
            )
            
            if result['success']:
                return {
                    'success': True,
                    'contact': result['data'].get('contact', {}),
                    'data': result['data']
                }
            else:
                return {
                    'success': False,
                    'error': result['error']
                }
        
        except Exception as e:
            current_app.logger.error(f"Get contact error: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def search_contacts(self, query, user_id=None):
        """Search for contacts"""
        try:
            result = self._make_request(
                'GET',
                f'/contacts/search?query={query}',
                None,
                user_id,
                'search_contacts'
            )
            
            if result['success']:
                return {
                    'success': True,
                    'contacts': result['data'].get('contacts', []),
                    'data': result['data']
                }
            else:
                return {
                    'success': False,
                    'error': result['error']
                }
        
        except Exception as e:
            current_app.logger.error(f"Search contacts error: {e}")
            return {
                'success': False,
                'error': str(e)
            }

