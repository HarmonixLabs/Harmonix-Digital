import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/lib/auth';
import { 
  Code2, TestTube, GitBranch, PlayCircle, Settings,
  FileText, Terminal, Zap, Database, Globe,
  Plus, Save, Trash2, Copy, Share2,
  CheckCircle2, AlertCircle, Clock, Loader2
} from 'lucide-react';
import { FaSlack, FaGoogle } from 'react-icons/fa';
import { SiNotion, SiAirtable } from 'react-icons/si';

// Mock agent drafts
const mockDrafts = [
  { id: 1, name: 'Customer Onboarding Bot', version: 'v1.2', lastEdited: '2 hours ago', status: 'draft' },
  { id: 2, name: 'Data Analysis Agent', version: 'v2.0', lastEdited: '1 day ago', status: 'testing' },
  { id: 3, name: 'Lead Qualifier', version: 'v1.0', lastEdited: '3 days ago', status: 'published' },
];

// Integration options
const integrations = [
  { id: 'slack', name: 'Slack', icon: FaSlack, connected: true },
  { id: 'google', name: 'Google Workspace', icon: FaGoogle, connected: false },
  { id: 'notion', name: 'Notion', icon: SiNotion, connected: false },
  { id: 'airtable', name: 'Airtable', icon: SiAirtable, connected: true },
];

export default function AgentCreatorDashboard() {
  const { user } = useAuth();
  const [activeTest, setActiveTest] = useState(false);
  const [testOutput, setTestOutput] = useState('');
  const [selectedDraft, setSelectedDraft] = useState(mockDrafts[0]);
  const [agentPrompt, setAgentPrompt] = useState('');

  const handleTestAgent = () => {
    setActiveTest(true);
    setTestOutput('Processing...');
    
    // Simulate test execution
    setTimeout(() => {
      setTestOutput(`
✅ Agent initialized successfully
✅ Connected to Slack workspace
✅ Webhook configured
📝 Test run:
  - Input: "New customer John Doe signed up"
  - Action: Created Slack notification
  - Result: Message sent to #new-customers channel
✅ Test completed successfully
      `);
      setActiveTest(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-harmonix-regal-gold">
            Agent Builder Studio
          </h1>
          <p className="text-harmonix-sage-fade mt-1">
            Create, test, and deploy intelligent AI agents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Docs
          </Button>
          <Button size="sm" className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest">
            <Plus className="h-4 w-4 mr-2" />
            New Agent
          </Button>
        </div>
      </div>

      {/* Main Builder Interface */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Agent Configuration */}
        <div className="space-y-4">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Agent Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Agent Metadata */}
              <div className="space-y-2">
                <Label htmlFor="agent-name" className="text-harmonix-sage-fade">
                  Agent Name
                </Label>
                <Input
                  id="agent-name"
                  value={selectedDraft.name}
                  className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white"
                  placeholder="Enter agent name..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent-type" className="text-harmonix-sage-fade">
                  Agent Type
                </Label>
                <Select defaultValue="customer-service">
                  <SelectTrigger className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Agent Prompt */}
              <div className="space-y-2">
                <Label htmlFor="agent-prompt" className="text-harmonix-sage-fade">
                  Agent Instructions
                </Label>
                <Textarea
                  id="agent-prompt"
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                  placeholder="Describe what your agent should do. Be specific about triggers, actions, and expected behavior..."
                  className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white placeholder:text-harmonix-sage-fade/50 min-h-[200px]"
                />
              </div>

              {/* Triggers */}
              <div className="space-y-2">
                <Label className="text-harmonix-sage-fade">Triggers</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-harmonix-deep-forest/50 rounded-lg">
                    <span className="text-white text-sm">On new customer signup</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-harmonix-deep-forest/50 rounded-lg">
                    <span className="text-white text-sm">Every 30 minutes</span>
                    <Switch />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Trigger
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="outline" onClick={handleTestAgent} disabled={activeTest}>
                  {activeTest ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Agent
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Integration Connectors
              </CardTitle>
              <CardDescription className="text-harmonix-sage-fade">
                Connect external services to your agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrations.map((integration) => {
                const Icon = integration.icon;
                return (
                  <div key={integration.id} className="flex items-center justify-between p-3 bg-harmonix-deep-forest/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-harmonix-sage-fade" />
                      <span className="text-white">{integration.name}</span>
                    </div>
                    {integration.connected ? (
                      <Badge className="bg-green-600">Connected</Badge>
                    ) : (
                      <Button size="sm" variant="outline">
                        Connect
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Flow Preview & Testing */}
        <div className="space-y-4">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-harmonix-regal-gold flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Agent Flow & Testing
                </CardTitle>
                <Badge variant="outline" className="text-harmonix-sage-fade">
                  {selectedDraft.version}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="flow" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-harmonix-deep-forest/50">
                  <TabsTrigger value="flow">Flow</TabsTrigger>
                  <TabsTrigger value="test">Test</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                {/* Flow Visualization */}
                <TabsContent value="flow" className="space-y-4">
                  <div className="h-96 bg-harmonix-deep-forest/50 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center text-harmonix-sage-fade">
                      <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Agent workflow visualization</p>
                      <p className="text-sm mt-2">Drag and drop to build your flow</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Test Console */}
                <TabsContent value="test" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-harmonix-sage-fade">Test Input</Label>
                      <Textarea
                        placeholder="Enter test data or scenario..."
                        className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white"
                      />
                    </div>
                    <Button className="w-full" onClick={handleTestAgent} disabled={activeTest}>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Run Test
                    </Button>
                    {testOutput && (
                      <div className="bg-harmonix-deep-forest/50 rounded-lg p-4">
                        <pre className="text-xs text-harmonix-sage-fade whitespace-pre-wrap font-mono">
                          {testOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Logs */}
                <TabsContent value="logs" className="space-y-4">
                  <div className="h-96 bg-harmonix-deep-forest/50 rounded-lg p-4 overflow-y-auto">
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5" />
                        <span className="text-harmonix-sage-fade">[12:34:56] Agent initialized</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-3 w-3 text-yellow-400 mt-0.5" />
                        <span className="text-harmonix-sage-fade">[12:34:57] Waiting for trigger...</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5" />
                        <span className="text-harmonix-sage-fade">[12:35:02] Trigger received: new_customer</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5" />
                        <span className="text-harmonix-sage-fade">[12:35:03] Action executed: send_slack_notification</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Agent Drafts */}
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">My Agent Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className={`flex items-center justify-between p-3 bg-harmonix-deep-forest/50 rounded-lg cursor-pointer hover:bg-harmonix-deep-forest/70 transition-colors ${
                      selectedDraft.id === draft.id ? 'ring-2 ring-harmonix-regal-gold' : ''
                    }`}
                    onClick={() => setSelectedDraft(draft)}
                  >
                    <div>
                      <p className="text-white font-medium">{draft.name}</p>
                      <p className="text-xs text-harmonix-sage-fade">{draft.version} • {draft.lastEdited}</p>
                    </div>
                    <Badge variant={draft.status === 'published' ? 'default' : 'secondary'}>
                      {draft.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}