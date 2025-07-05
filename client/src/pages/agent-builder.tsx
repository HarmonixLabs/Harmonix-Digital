import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Save, 
  Play, 
  Upload, 
  Code, 
  Wand2, 
  Zap, 
  Clock, 
  MessageSquare,
  Database,
  Plus,
  Trash2,
  ChevronRight,
  Settings,
  Eye,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

// Flow diagram component placeholder
const FlowDiagram = ({ nodes, connections }: { nodes: any[], connections: any[] }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={canvasRef} className="relative w-full h-full bg-harmonix-deep-forest/20 rounded-lg border border-harmonix-sage-fade/20">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto w-32 h-32 rounded-full bg-harmonix-cedar-green/20 flex items-center justify-center">
              <Wand2 className="h-16 w-16 text-harmonix-regal-gold" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-harmonix-sage-fade mb-2">Visual Flow Canvas</h3>
          <p className="text-sm text-harmonix-sage-fade/70">
            Connect nodes to create your agent's workflow
          </p>
        </div>
      </div>
      
      {/* Placeholder nodes */}
      {nodes.map((node, index) => (
        <div
          key={node.id}
          className="absolute bg-harmonix-night-pine border border-harmonix-sage-fade/30 rounded-lg p-4"
          style={{ 
            left: `${20 + (index % 3) * 200}px`, 
            top: `${20 + Math.floor(index / 3) * 120}px` 
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <node.icon className="h-4 w-4 text-harmonix-regal-gold" />
            <span className="text-sm font-medium text-harmonix-sage-fade">{node.name}</span>
          </div>
          <p className="text-xs text-harmonix-sage-fade/70">{node.description}</p>
        </div>
      ))}
    </div>
  );
};

export default function AgentBuilder() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('basic');
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Agent configuration state
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    description: '',
    prompt: '',
    avatar: '',
    tags: [],
    licenseType: 'subscription',
    integrations: [],
    triggers: []
  });
  
  // Flow nodes state
  const [flowNodes, setFlowNodes] = useState([
    { id: '1', name: 'Trigger', icon: Zap, description: 'Start workflow' },
    { id: '2', name: 'Process', icon: Code, description: 'Process data' },
    { id: '3', name: 'Output', icon: Upload, description: 'Return result' }
  ]);
  
  const handleDeploy = async () => {
    if (!agentConfig.name || !agentConfig.prompt) {
      toast({
        title: "Missing Information",
        description: "Please provide agent name and prompt",
        variant: "destructive"
      });
      return;
    }
    
    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      toast({
        title: "Agent Deployed!",
        description: "Your agent is being minted as an NFT on Polygon",
      });
      
      // Redirect to marketplace after deployment
      setTimeout(() => {
        setLocation('/agent-marketplace');
      }, 2000);
    }, 3000);
  };
  
  const handleAddNode = (type: string) => {
    const newNode = {
      id: `node-${Date.now()}`,
      name: type,
      icon: type === 'API' ? Database : type === 'Schedule' ? Clock : MessageSquare,
      description: `${type} node`
    };
    setFlowNodes([...flowNodes, newNode]);
  };

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-harmonix-night-pine/90 backdrop-blur-sm border-b border-harmonix-sage-fade/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-harmonix-sage-fade">
                <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-harmonix-regal-gold">Agent Builder</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="text-harmonix-sage-fade">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" className="text-harmonix-sage-fade">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              className="bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>
                  <Rocket className="h-4 w-4 mr-2 animate-pulse" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy Agent
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Configuration */}
        <div className="w-1/2 border-r border-harmonix-sage-fade/20">
          <ScrollArea className="h-full">
            <div className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="logic">Agent Logic</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  <TabsTrigger value="deploy">Deploy Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="name">Agent Name</Label>
                    <Input 
                      id="name"
                      placeholder="e.g., Echo AI Writer"
                      value={agentConfig.name}
                      onChange={(e) => setAgentConfig({ ...agentConfig, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Brief description of what your agent does..."
                      value={agentConfig.description}
                      onChange={(e) => setAgentConfig({ ...agentConfig, description: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input 
                      id="tags"
                      placeholder="marketing, content, automation"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="license">License Type</Label>
                    <Select 
                      value={agentConfig.licenseType}
                      onValueChange={(value) => setAgentConfig({ ...agentConfig, licenseType: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="single">Single Use</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="logic" className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="prompt">Natural Language Prompt</Label>
                    <Textarea 
                      id="prompt"
                      placeholder="Describe what your agent should do in plain English..."
                      value={agentConfig.prompt}
                      onChange={(e) => setAgentConfig({ ...agentConfig, prompt: e.target.value })}
                      className="mt-1"
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <Label>Use Case Templates</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button variant="outline" size="sm" className="justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Customer Support
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Code className="h-4 w-4 mr-2" />
                        Code Assistant
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Database className="h-4 w-4 mr-2" />
                        Data Analysis
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Wand2 className="h-4 w-4 mr-2" />
                        Content Creation
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4 mt-6">
                  <div>
                    <Label>Integration Hooks</Label>
                    <div className="space-y-2 mt-2">
                      {['Zapier', 'Slack', 'Notion', 'Google Sheets', 'Discord', 'Email'].map((integration) => (
                        <label key={integration} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-harmonix-sage-fade">{integration}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Trigger Types</Label>
                    <div className="space-y-2 mt-2">
                      {[
                        { id: 'api', label: 'API Call', icon: Database },
                        { id: 'schedule', label: 'Scheduled Job', icon: Clock },
                        { id: 'webhook', label: 'Webhook', icon: Zap },
                        { id: 'chat', label: 'Chat Command', icon: MessageSquare }
                      ].map((trigger) => (
                        <label key={trigger.id} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <trigger.icon className="h-4 w-4 text-harmonix-sage-fade/70" />
                          <span className="text-sm text-harmonix-sage-fade">{trigger.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="deploy" className="space-y-4 mt-6">
                  <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
                    <CardHeader>
                      <CardTitle className="text-harmonix-regal-gold">Deployment Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>NFT Metadata</Label>
                        <p className="text-sm text-harmonix-sage-fade/70 mt-1">
                          Your agent will be minted as an ERC-721 NFT on Polygon
                        </p>
                      </div>
                      
                      <div>
                        <Label>Pricing Model</Label>
                        <Select defaultValue="monthly">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="onetime">One-time ($99)</SelectItem>
                            <SelectItem value="monthly">Monthly ($29/mo)</SelectItem>
                            <SelectItem value="usage">Per-use ($0.10/call)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Revenue Split</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">70% Creator</Badge>
                          <Badge variant="outline">30% Platform</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Visual Flow */}
        <div className="w-1/2 bg-harmonix-deep-forest/30">
          <div className="h-full p-6">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-harmonix-sage-fade">Visual Flow Designer</h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAddNode('API')}
                    className="text-harmonix-sage-fade"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Node
                  </Button>
                  <Button size="sm" variant="ghost" className="text-harmonix-sage-fade">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <FlowDiagram nodes={flowNodes} connections={[]} />
              </div>
              
              <div className="mt-4 p-4 bg-harmonix-night-pine/50 rounded-lg border border-harmonix-sage-fade/20">
                <div className="flex items-center gap-2 text-sm text-harmonix-sage-fade">
                  <Play className="h-4 w-4" />
                  <span>Click nodes to edit • Drag to connect • Right-click for options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}