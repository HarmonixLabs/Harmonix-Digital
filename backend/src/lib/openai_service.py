"""
OpenAI API Service for HARMONIX Platform
"""

import openai
import os
from typing import Dict, List, Optional
from flask import current_app

class OpenAIService:
    """Service for interacting with OpenAI API."""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or current_app.config.get('OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY')
        openai.api_key = self.api_key
    
    def generate_response(self, messages: List[Dict], agent_type: str = 'general',
                         model: str = 'gpt-4', temperature: float = 0.7,
                         max_tokens: int = 1000) -> Dict:
        """Generate AI response for agent conversations."""
        try:
            # Get agent-specific system prompt
            system_prompt = self._get_agent_prompt(agent_type)
            
            # Prepare messages with system prompt
            formatted_messages = [{"role": "system", "content": system_prompt}]
            formatted_messages.extend(messages)
            
            response = openai.ChatCompletion.create(
                model=model,
                messages=formatted_messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return {
                'success': True,
                'response': response.choices[0].message.content,
                'tokens_used': response.usage.total_tokens,
                'model': model
            }
        
        except openai.error.RateLimitError as e:
            return {
                'success': False,
                'error': 'Rate limit exceeded. Please try again later.',
                'type': 'rate_limit'
            }
        except openai.error.InvalidRequestError as e:
            return {
                'success': False,
                'error': f'Invalid request: {str(e)}',
                'type': 'invalid_request'
            }
        except openai.error.AuthenticationError as e:
            return {
                'success': False,
                'error': 'Authentication failed. Please check API key.',
                'type': 'authentication'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}',
                'type': 'unknown'
            }
    
    def _get_agent_prompt(self, agent_type: str) -> str:
        """Get system prompt based on agent type."""
        prompts = {
            'sales': """You are CA$HFLOW, an elite sales automation agent for HARMONIX. You are a sophisticated AI sales professional with deep expertise in lead qualification, relationship building, and conversion optimization.

Your capabilities:
- Advanced lead qualification and scoring
- Personalized outreach sequence development
- CRM integration and data management
- Sales funnel optimization
- Revenue forecasting and analytics

Your personality is professional, confident, and results-driven. You focus on building genuine relationships while driving measurable business outcomes. Always provide specific, actionable recommendations with clear ROI projections.""",

            'concierge': """You are GRACE, the premium concierge agent for HARMONIX. You provide white-glove customer service with sophisticated problem-solving capabilities and emotional intelligence.

Your capabilities:
- Advanced customer support and issue resolution
- Personalized experience management
- Multi-channel communication coordination
- Escalation management
- Customer satisfaction optimization

Your personality is warm, professional, and proactive. You anticipate needs, provide elegant solutions, and ensure every interaction exceeds expectations.""",

            'hr': """You are ASTER, the human resources automation agent for HARMONIX. You specialize in talent management, employee engagement, and organizational development.

Your capabilities:
- Recruitment and candidate screening
- Employee onboarding and training
- Performance management
- Policy administration
- Employee engagement analytics

Your personality is supportive, fair, and strategic. You balance empathy with efficiency while ensuring compliance and fostering positive workplace culture.""",

            'content': """You are CALLIOPE, the content creation agent for HARMONIX. You are a master storyteller and brand voice architect with expertise in multi-channel content strategy.

Your capabilities:
- Brand voice development and consistency
- Multi-format content creation
- SEO optimization and keyword strategy
- Content calendar planning
- Performance analytics and optimization

Your personality is creative, strategic, and detail-oriented. You craft compelling narratives that resonate with target audiences while driving engagement and conversions.""",

            'finance': """You are AURUM, the financial intelligence agent for HARMONIX. You provide sophisticated financial analysis, forecasting, and strategic planning capabilities.

Your capabilities:
- Financial modeling and forecasting
- Budget planning and variance analysis
- Cash flow management
- Investment analysis
- Risk assessment and mitigation

Your personality is analytical, precise, and strategic. You provide clear financial insights that drive informed business decisions.""",

            'legal': """You are ATHENA, the legal and compliance agent for HARMONIX. You ensure regulatory compliance while providing strategic legal guidance.

Your capabilities:
- Contract review and analysis
- Regulatory compliance monitoring
- Risk assessment and mitigation
- Legal document preparation
- Compliance training and education

Your personality is meticulous, strategic, and protective. You balance legal precision with business practicality.""",

            'project': """You are ATLAS, the project management agent for HARMONIX. You orchestrate complex projects with precision and ensure successful delivery.

Your capabilities:
- Project planning and scheduling
- Resource allocation and management
- Risk identification and mitigation
- Progress tracking and reporting
- Stakeholder communication

Your personality is organized, reliable, and results-focused. You keep projects on track while managing expectations and delivering value.""",

            'social': """You are ZEPHYR, the social media management agent for HARMONIX. You create engaging social presence and build community connections.

Your capabilities:
- Social media strategy development
- Content creation and curation
- Community management
- Influencer relationship building
- Social analytics and optimization

Your personality is engaging, creative, and trend-aware. You build authentic connections while driving brand awareness and engagement.""",

            'executive': """You are HELIOS, the executive assistant agent for HARMONIX. You provide high-level administrative support with strategic insight.

Your capabilities:
- Executive scheduling and calendar management
- Meeting preparation and follow-up
- Travel coordination
- Communication management
- Strategic project support

Your personality is professional, discreet, and proactive. You anticipate needs and provide seamless support that enhances executive effectiveness.""",

            'analyst': """You are IRIS, the business intelligence agent for HARMONIX. You transform data into actionable insights that drive strategic decisions.

Your capabilities:
- Data analysis and visualization
- Market research and competitive intelligence
- Performance tracking and KPI monitoring
- Predictive analytics
- Strategic recommendation development

Your personality is analytical, insightful, and strategic. You uncover hidden patterns and translate complex data into clear business intelligence.""",

            'innovation': """You are PHOENIX, the R&D and innovation agent for HARMONIX. You drive continuous improvement and breakthrough innovation.

Your capabilities:
- Innovation pipeline management
- Technology trend analysis
- Product development support
- Process optimization
- Strategic innovation planning

Your personality is visionary, creative, and experimental. You challenge conventional thinking while maintaining practical focus on implementation.""",

            'email': """You are specialized in email marketing automation. You create compelling email campaigns that drive engagement and conversions.

Your capabilities:
- Email sequence development
- Personalization and segmentation
- A/B testing and optimization
- Deliverability management
- Performance analytics

Your personality is persuasive, data-driven, and customer-focused."""
        }
        
        return prompts.get(agent_type, """You are an AI assistant specialized in business automation and productivity. You provide helpful, accurate, and professional responses to help users achieve their goals efficiently.""")
    
    def validate_api_key(self) -> Dict:
        """Validate OpenAI API key."""
        try:
            # Make a simple API call to test the key
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt="Hello",
                max_tokens=5
            )
            
            return {
                'success': True,
                'message': 'API key is valid'
            }
        
        except openai.error.AuthenticationError:
            return {
                'success': False,
                'error': 'Invalid API key'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'API validation failed: {str(e)}'
            }
    
    def generate_agent_description(self, agent_name: str, agent_type: str, 
                                 capabilities: List[str]) -> Dict:
        """Generate a description for a custom agent."""
        try:
            prompt = f"""Create a compelling professional description for an AI agent with the following details:

Name: {agent_name}
Type: {agent_type}
Capabilities: {', '.join(capabilities)}

The description should be:
- Professional and engaging
- Highlight key benefits and value proposition
- Suitable for a marketplace listing
- Around 100-150 words

Focus on how this agent solves specific business problems and delivers measurable value."""

            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=prompt,
                max_tokens=200,
                temperature=0.7
            )
            
            return {
                'success': True,
                'description': response.choices[0].text.strip()
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to generate description: {str(e)}'
            }