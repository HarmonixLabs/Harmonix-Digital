"""
Harmony Platform - Enhanced Pipedream Integration
Connects to the actual 6 Harmony agents deployed in Pipedream
"""

import requests
import json
import time
import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
import asyncio
import aiohttp
from functools import wraps
import hashlib
import hmac
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HarmonyAgent(Enum):
    CASH = "cash"           # Lead management/sales
    ECHO = "echo"           # Content posting/social media
    FLOW = "flow"           # Process optimization  
    GRACE = "grace"         # Customer support
    KAIROS = "kairos"       # Project management
    SOL = "sol"             # Orchestration hub

@dataclass
class AgentRequest:
    agent_id: str
    user_id: str
    session_id: str
    task: str
    input_data: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None
    priority: int = 1
    timeout: int = 30

@dataclass
class AgentResponse:
    agent_id: str
    user_id: str
    session_id: str
    task: str
    output_data: Dict[str, Any]
    status: str
    execution_time: float
    timestamp: datetime
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class HarmonyPipedreamService:
    """Enhanced service for Harmony's actual Pipedream agents"""
    
    def __init__(self):
        # Actual Pipedream credentials and webhooks
        self.client_id = "Za1rlgGAbnPZ6XgD_Cg1Tqnpyei9ZF0EOF7QZ1Fh9Vw"
        self.client_secret = "SpndWa9lq7bTadKqTE8CrYRimaF3eIbOm2_v5SOL4SQ"
        self.api_key = "91b93b742615b9e063fc88c7d2e63b64"
        
        # Agent webhook mappings
        self.agent_webhooks = {
            HarmonyAgent.CASH: {
                "webhook_url": "https://eo23u9ufn73cdhy.m.pipedream.net",
                "name": "CASH - Lead Management & Sales",
                "description": "Handles lead qualification, sales processes, and revenue optimization",
                "capabilities": ["lead_scoring", "sales_automation", "crm_integration", "booking"],
                "timeout": 30
            },
            HarmonyAgent.ECHO: {
                "webhook_url": "https://eonvbjxovddzlaj.m.pipedream.net", 
                "name": "ECHO - Content & Social Media",
                "description": "Creates and posts content across social media platforms",
                "capabilities": ["content_creation", "social_posting", "brand_voice", "scheduling"],
                "timeout": 45
            },
            HarmonyAgent.FLOW: {
                "webhook_url": "https://eoebhnlvmpgfa4i.m.pipedream.net",
                "name": "FLOW - Process Optimization", 
                "description": "Analyzes and optimizes business processes and workflows",
                "capabilities": ["process_analysis", "workflow_optimization", "sop_creation", "automation"],
                "timeout": 60
            },
            HarmonyAgent.GRACE: {
                "webhook_url": "https://eolfvvzcboweq72.m.pipedream.net",
                "name": "GRACE - Customer Support",
                "description": "Provides intelligent customer support and relationship management", 
                "capabilities": ["customer_support", "ticket_management", "relationship_building", "onboarding"],
                "timeout": 30
            },
            HarmonyAgent.KAIROS: {
                "webhook_url": "https://eotv63jouum0j3m.m.pipedream.net",
                "name": "KAIROS - Project Management",
                "description": "Manages projects, timelines, and team coordination",
                "capabilities": ["project_planning", "timeline_management", "team_coordination", "milestone_tracking"],
                "timeout": 45
            },
            HarmonyAgent.SOL: {
                "webhook_url": "https://eoww91ocph942ds.m.pipedream.net",
                "name": "SOL - Orchestration Hub", 
                "description": "Orchestrates multi-agent workflows and system coordination",
                "capabilities": ["agent_orchestration", "workflow_routing", "system_coordination", "decision_making"],
                "timeout": 60
            }
        }
        
        # Session management
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "User-Agent": "Harmony-Platform/1.0",
            "X-Client-ID": self.client_id
        })
        
        # Rate limiting and caching
        self.rate_limit_window = 60
        self.max_requests_per_window = 100
        self.request_timestamps = []
        self.cache = {}
        self.cache_ttl = 300
    
    def _check_rate_limit(self) -> bool:
        """Check if we're within rate limits"""
        now = time.time()
        self.request_timestamps = [ts for ts in self.request_timestamps 
                                 if now - ts < self.rate_limit_window]
        
        if len(self.request_timestamps) >= self.max_requests_per_window:
            raise Exception("Rate limit exceeded")
        
        self.request_timestamps.append(now)
        return True
    
    async def execute_agent(self, request: AgentRequest) -> AgentResponse:
        """Execute a specific Harmony agent via Pipedream webhook"""
        start_time = time.time()
        
        try:
            # Check rate limits
            self._check_rate_limit()
            
            # Get agent configuration
            agent_type = HarmonyAgent(request.agent_id)
            agent_config = self.agent_webhooks.get(agent_type)
            
            if not agent_config:
                raise Exception(f"Unknown agent: {request.agent_id}")
            
            # Prepare payload for Pipedream webhook
            payload = {
                "agent_id": request.agent_id,
                "user_id": request.user_id,
                "session_id": request.session_id,
                "task": request.task,
                "input_data": request.input_data,
                "context": request.context or {},
                "timestamp": datetime.utcnow().isoformat(),
                "priority": request.priority,
                "harmony_platform": {
                    "version": "1.0",
                    "client_id": self.client_id,
                    "request_id": str(uuid.uuid4())
                }
            }
            
            # Execute webhook
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    agent_config["webhook_url"],
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=agent_config["timeout"])
                ) as response:
                    
                    if response.status >= 400:
                        error_text = await response.text()
                        raise Exception(f"Agent {request.agent_id} error {response.status}: {error_text}")
                    
                    try:
                        result_data = await response.json()
                    except:
                        # If response is not JSON, treat as text
                        result_text = await response.text()
                        result_data = {"output": result_text, "raw_response": True}
            
            execution_time = time.time() - start_time
            
            # Create response object
            agent_response = AgentResponse(
                agent_id=request.agent_id,
                user_id=request.user_id,
                session_id=request.session_id,
                task=request.task,
                output_data=result_data,
                status="success",
                execution_time=execution_time,
                timestamp=datetime.utcnow(),
                metadata={
                    "agent_name": agent_config["name"],
                    "webhook_url": agent_config["webhook_url"],
                    "capabilities": agent_config["capabilities"]
                }
            )
            
            logger.info(f"Successfully executed {request.agent_id} task '{request.task}' in {execution_time:.2f}s")
            return agent_response
            
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(f"Error executing {request.agent_id}: {e}")
            
            return AgentResponse(
                agent_id=request.agent_id,
                user_id=request.user_id,
                session_id=request.session_id,
                task=request.task,
                output_data={},
                status="error",
                execution_time=execution_time,
                timestamp=datetime.utcnow(),
                error=str(e)
            )
    
    async def orchestrate_workflow(self, workflow_name: str, user_id: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Use SOL agent to orchestrate complex multi-agent workflows"""
        session_id = f"workflow_{int(time.time())}"
        
        # Send workflow request to SOL orchestration agent
        sol_request = AgentRequest(
            agent_id=HarmonyAgent.SOL.value,
            user_id=user_id,
            session_id=session_id,
            task="orchestrate_workflow",
            input_data={
                "workflow_name": workflow_name,
                "workflow_data": input_data,
                "available_agents": list(self.agent_webhooks.keys()),
                "user_context": {
                    "user_id": user_id,
                    "session_id": session_id
                }
            }
        )
        
        sol_response = await self.execute_agent(sol_request)
        
        if sol_response.status == "success":
            # SOL should return a workflow plan with agent tasks
            workflow_plan = sol_response.output_data.get("workflow_plan", [])
            results = {"orchestration": sol_response.output_data, "agent_results": []}
            
            # Execute each step in the workflow plan
            for step in workflow_plan:
                if "agent_id" in step and "task" in step:
                    step_request = AgentRequest(
                        agent_id=step["agent_id"],
                        user_id=user_id,
                        session_id=session_id,
                        task=step["task"],
                        input_data=step.get("input_data", {}),
                        context=step.get("context", {})
                    )
                    
                    step_response = await self.execute_agent(step_request)
                    results["agent_results"].append({
                        "step": step,
                        "response": asdict(step_response)
                    })
            
            return {
                "workflow": workflow_name,
                "status": "completed",
                "session_id": session_id,
                "results": results
            }
        else:
            return {
                "workflow": workflow_name,
                "status": "failed",
                "session_id": session_id,
                "error": sol_response.error
            }
    
    def get_agent_info(self, agent_id: str) -> Dict[str, Any]:
        """Get information about a specific agent"""
        try:
            agent_type = HarmonyAgent(agent_id)
            config = self.agent_webhooks.get(agent_type)
            if config:
                return {
                    "agent_id": agent_id,
                    "name": config["name"],
                    "description": config["description"],
                    "capabilities": config["capabilities"],
                    "webhook_url": config["webhook_url"],
                    "timeout": config["timeout"],
                    "status": "active"
                }
        except:
            pass
        
        return {"error": f"Agent {agent_id} not found"}
    
    def get_all_agents(self) -> List[Dict[str, Any]]:
        """Get information about all available agents"""
        agents = []
        for agent_type in HarmonyAgent:
            agent_info = self.get_agent_info(agent_type.value)
            if "error" not in agent_info:
                agents.append(agent_info)
        return agents

# Predefined workflow templates for common use cases
class WorkflowTemplates:
    """Predefined multi-agent workflow templates"""
    
    @staticmethod
    def content_marketing_campaign():
        return {
            "name": "content_marketing_campaign",
            "description": "Complete content marketing campaign creation and execution",
            "agents": ["kairos", "echo", "cash"],
            "steps": [
                {
                    "agent": "kairos",
                    "task": "create_campaign_timeline",
                    "description": "Plan campaign timeline and milestones"
                },
                {
                    "agent": "echo", 
                    "task": "create_content_calendar",
                    "description": "Generate content calendar and posts"
                },
                {
                    "agent": "cash",
                    "task": "setup_lead_capture",
                    "description": "Configure lead capture and sales funnels"
                }
            ]
        }
    
    @staticmethod
    def customer_onboarding():
        return {
            "name": "customer_onboarding",
            "description": "Automated customer onboarding process",
            "agents": ["grace", "flow", "kairos"],
            "steps": [
                {
                    "agent": "grace",
                    "task": "welcome_new_customer", 
                    "description": "Send welcome message and gather info"
                },
                {
                    "agent": "flow",
                    "task": "setup_customer_workflow",
                    "description": "Create customized workflow for customer"
                },
                {
                    "agent": "kairos",
                    "task": "schedule_onboarding_milestones",
                    "description": "Set up onboarding timeline and checkpoints"
                }
            ]
        }
    
    @staticmethod
    def business_optimization():
        return {
            "name": "business_optimization",
            "description": "Comprehensive business process optimization",
            "agents": ["flow", "cash", "kairos"],
            "steps": [
                {
                    "agent": "flow",
                    "task": "analyze_current_processes",
                    "description": "Analyze existing business processes"
                },
                {
                    "agent": "cash",
                    "task": "optimize_sales_funnel",
                    "description": "Optimize sales and revenue processes"
                },
                {
                    "agent": "kairos",
                    "task": "implement_optimization_plan",
                    "description": "Create implementation timeline"
                }
            ]
        }

# Example usage and testing functions
async def test_individual_agents():
    """Test individual agent functionality"""
    service = HarmonyPipedreamService()
    
    # Test CASH agent
    cash_request = AgentRequest(
        agent_id="cash",
        user_id="test_user_123",
        session_id="test_session_456",
        task="qualify_lead",
        input_data={
            "lead_data": {
                "name": "John Doe",
                "email": "john@example.com",
                "company": "Acme Corp",
                "budget": 10000,
                "timeline": "Q1 2024"
            }
        }
    )
    
    cash_response = await service.execute_agent(cash_request)
    print(f"CASH Response: {cash_response}")
    
    # Test ECHO agent
    echo_request = AgentRequest(
        agent_id="echo",
        user_id="test_user_123", 
        session_id="test_session_789",
        task="create_social_post",
        input_data={
            "topic": "AI automation benefits",
            "platform": "linkedin",
            "tone": "professional",
            "include_hashtags": True
        }
    )
    
    echo_response = await service.execute_agent(echo_request)
    print(f"ECHO Response: {echo_response}")

async def test_orchestrated_workflow():
    """Test SOL orchestration with multi-agent workflow"""
    service = HarmonyPipedreamService()
    
    workflow_result = await service.orchestrate_workflow(
        workflow_name="content_marketing_campaign",
        user_id="test_user_123",
        input_data={
            "campaign_goal": "increase_brand_awareness",
            "target_audience": "small_business_owners",
            "budget": 5000,
            "duration": "30_days",
            "platforms": ["linkedin", "twitter", "instagram"]
        }
    )
    
    print(f"Workflow Result: {workflow_result}")

async def main():
    """Main testing function"""
    print("Testing Harmony Pipedream Integration...")
    
    service = HarmonyPipedreamService()
    
    # Get all agent info
    agents = service.get_all_agents()
    print(f"Available Agents: {agents}")
    
    # Test individual agents
    await test_individual_agents()
    
    # Test orchestrated workflow
    await test_orchestrated_workflow()

if __name__ == "__main__":
    asyncio.run(main())

