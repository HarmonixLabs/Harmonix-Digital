import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface TestResult {
  agent: string;
  status: 'pending' | 'testing' | 'success' | 'error';
  message?: string;
  response?: any;
  duration?: number;
}

const agents = [
  {
    id: 'cash-agent',
    name: 'CA$H',
    description: 'Sales & Revenue Optimization',
    testMessage: 'I have a new lead named John Smith from TechCorp who is interested in our enterprise package. He has a budget of $50k and needs a solution within 30 days.',
    action: 'lead_qualification'
  },
  {
    id: 'grace-agent', 
    name: 'GRACE',
    description: 'Customer Support & Experience',
    testMessage: 'Customer Sarah Johnson submitted a support ticket about login issues. She cannot access her dashboard and has been trying for 2 hours.',
    action: 'support_request'
  },
  {
    id: 'echo-agent',
    name: 'ECHO', 
    description: 'Social Media & Content',
    testMessage: 'Create a LinkedIn post about our new AI agent launch targeting startup founders. Include engagement hooks and relevant hashtags.',
    action: 'content_creation'
  },
  {
    id: 'flow-agent',
    name: 'FLOW',
    description: 'Process Automation',
    testMessage: 'Analyze our customer onboarding process and identify bottlenecks. We currently have a 6-step process taking 3 days to complete.',
    action: 'process_optimization'
  },
  {
    id: 'kairos-agent',
    name: 'KAIROS',
    description: 'Project Management',
    testMessage: 'We need to plan the Q4 product launch. Timeline is 12 weeks, team of 8 people, budget $200k. Create a project roadmap.',
    action: 'project_planning'
  },
  {
    id: 'sol-agent',
    name: 'SOL',
    description: 'AI Orchestration & Strategy',
    testMessage: 'Analyze the performance of all 5 agents and recommend optimization strategies. Consider workload distribution and efficiency metrics.',
    action: 'system_analysis'
  }
];

export default function AgentTest() {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  const testAgent = async (agent: typeof agents[0], customMsg?: string) => {
    const agentId = agent.id;
    const startTime = Date.now();
    
    setTestResults(prev => ({
      ...prev,
      [agentId]: { agent: agent.name, status: 'testing' }
    }));

    try {
      const response = await apiRequest('POST', '/api/test-pipedream', {
        agentId,
        action: agent.action,
        data: {
          message: customMsg || agent.testMessage,
          test_mode: true,
          timestamp: new Date().toISOString(),
          agent_name: agent.name
        }
      });

      const duration = Date.now() - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [agentId]: {
          agent: agent.name,
          status: 'success',
          message: 'Workflow executed successfully',
          response: response,
          duration
        }
      }));

      return { success: true, response };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [agentId]: {
          agent: agent.name,
          status: 'error',
          message: error.message || 'Test failed',
          duration
        }
      }));

      return { success: false, error: error.message };
    }
  };

  const testAllAgents = async () => {
    setIsTestingAll(true);
    
    // Reset all results
    const initialResults: Record<string, TestResult> = {};
    agents.forEach(agent => {
      initialResults[agent.id] = { agent: agent.name, status: 'pending' };
    });
    setTestResults(initialResults);

    // Test agents sequentially to avoid overwhelming
    for (const agent of agents) {
      await testAgent(agent);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsTestingAll(false);
  };

  const testSingleAgent = async () => {
    if (!selectedAgent || !customMessage.trim()) return;
    
    const agent = agents.find(a => a.id === selectedAgent);
    if (agent) {
      await testAgent(agent, customMessage);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pending: 'secondary',
      testing: 'default',
      success: 'default',
      error: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-gray-100 text-gray-600',
      testing: 'bg-blue-100 text-blue-600',
      success: 'bg-green-100 text-green-600', 
      error: 'bg-red-100 text-red-600'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Integration Testing</h1>
        <p className="text-gray-600">Test live Pipedream integration for all 6 Harmonix agents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bulk Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test All Agents</CardTitle>
            <CardDescription>
              Run predefined test scenarios for all 6 agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testAllAgents} 
              disabled={isTestingAll}
              className="w-full"
            >
              {isTestingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Agents...
                </>
              ) : (
                'Test All Agents'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Single Agent Test */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Agent Test</CardTitle>
            <CardDescription>
              Test a specific agent with your own message
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <select 
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an agent...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.description}
                </option>
              ))}
            </select>
            
            <Input
              placeholder="Enter test message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            
            <Button 
              onClick={testSingleAgent}
              disabled={!selectedAgent || !customMessage.trim()}
              className="w-full"
            >
              Test Agent
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => {
          const result = testResults[agent.id];
          
          return (
            <Card key={agent.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  {result && getStatusIcon(result.status)}
                </div>
                <CardDescription className="text-sm">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {result && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      {getStatusBadge(result.status)}
                    </div>
                    
                    {result.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm text-gray-600">{result.duration}ms</span>
                      </div>
                    )}
                    
                    {result.message && (
                      <div className="text-sm">
                        <span className="font-medium">Result:</span>
                        <p className={`mt-1 ${result.status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                          {result.message}
                        </p>
                      </div>
                    )}
                    
                    {result.response && result.status === 'success' && (
                      <details className="text-xs">
                        <summary className="cursor-pointer font-medium text-blue-600">
                          View Response
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      </details>
                    )}
                  </>
                )}
                
                {!result && (
                  <div className="text-sm text-gray-500">
                    Ready to test
                  </div>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testAgent(agent)}
                  disabled={result?.status === 'testing' || isTestingAll}
                  className="w-full"
                >
                  {result?.status === 'testing' ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Agent'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {Object.keys(testResults).length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {Object.values(testResults).filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(testResults).filter(r => r.status === 'testing').length}
                </div>
                <div className="text-sm text-gray-500">Testing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-gray-500">Success</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}