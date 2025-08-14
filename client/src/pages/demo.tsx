import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  DollarSign, 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Users,
  Send,
  Sparkles,
  Lock,
  Unlock,
  PlayCircle,
  RefreshCw,
  Download,
  ChevronRight,
  Activity,
  TrendingUp,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  Bot,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Settings
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// Agent configuration
const agents = [
  {
    id: "sol",
    name: "SŌL",
    title: "Harmony Brain",
    description: "Strategic orchestrator & master coordinator",
    icon: Brain,
    color: "from-purple-500 to-indigo-600",
    borderColor: "border-purple-500/20",
    bgColor: "bg-purple-500/10",
    available: true,
    skills: ["Strategy Planning", "Agent Coordination", "Goal Optimization", "Decision Making"],
    integrations: ["All Agents", "Analytics", "Reporting"],
    metrics: { strategies: 0, decisions: 0, insights: 0 }
  },
  {
    id: "cash",
    name: "CA$H",
    title: "AI Sales Closer",
    description: "Lead capture & sales automation specialist",
    icon: DollarSign,
    color: "from-emerald-500 to-green-600",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/10",
    available: true,
    skills: ["Lead Qualification", "Sales Closing", "Appointment Setting", "Follow-ups"],
    integrations: ["HubSpot", "Salesforce", "Calendly", "Stripe"],
    metrics: { leads: 0, meetings: 0, closed: 0 }
  },
  {
    id: "echo",
    name: "ECHO",
    title: "Content Storycaster",
    description: "Content planner & social media wizard",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-600",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/10",
    available: true,
    skills: ["Content Creation", "Social Posts", "Blog Writing", "Video Scripts"],
    integrations: ["Buffer", "Hootsuite", "WordPress", "YouTube"],
    metrics: { posts: 0, engagement: 0, reach: 0 }
  },
  {
    id: "flow",
    name: "FLOW",
    title: "Ops Optimizer",
    description: "Operations & workflow automation expert",
    icon: GitBranch,
    color: "from-orange-500 to-red-600",
    borderColor: "border-orange-500/20",
    bgColor: "bg-orange-500/10",
    available: true,
    skills: ["Process Mapping", "SOP Creation", "Automation", "Integration"],
    integrations: ["Zapier", "Make", "Notion", "Monday.com"],
    metrics: { workflows: 0, automated: 0, saved: 0 }
  },
  {
    id: "kairos",
    name: "KAIROS",
    title: "Time Manager",
    description: "Project timeline & scheduling guru",
    icon: Clock,
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/20",
    bgColor: "bg-violet-500/10",
    available: true,
    skills: ["Project Planning", "Timeline Creation", "Resource Allocation", "Deadline Management"],
    integrations: ["Google Calendar", "Asana", "Trello", "Jira"],
    metrics: { projects: 0, tasks: 0, onTime: 0 }
  },
  {
    id: "concierge",
    name: "CONCIERGE",
    title: "Client Success",
    description: "Onboarding, support & retention specialist",
    icon: Users,
    color: "from-pink-500 to-rose-600",
    borderColor: "border-pink-500/20",
    bgColor: "bg-pink-500/10",
    available: true,
    skills: ["Customer Support", "Onboarding", "FAQ Handling", "Satisfaction Surveys"],
    integrations: ["Intercom", "Zendesk", "Slack", "Discord"],
    metrics: { tickets: 0, satisfaction: 0, retention: 0 }
  }
];

// Demo conversation starters for each agent
const starterPrompts = {
  sol: [
    "What's the best strategy to scale my business?",
    "How can I optimize my team's productivity?",
    "Analyze my current operations and suggest improvements"
  ],
  cash: [
    "Help me close more deals this quarter",
    "Create a follow-up sequence for cold leads",
    "Book meetings with my top prospects"
  ],
  echo: [
    "Generate a week of social media content",
    "Write a blog post about AI in business",
    "Create a content calendar for next month"
  ],
  flow: [
    "Optimize my customer onboarding process",
    "Create an SOP for our sales team",
    "Automate my repetitive tasks"
  ],
  kairos: [
    "Create a project timeline for my app launch",
    "Help me manage multiple deadlines",
    "Build a Gantt chart for my team"
  ],
  concierge: [
    "Handle my customer support tickets",
    "Create an onboarding flow for new clients",
    "Set up satisfaction surveys"
  ]
};

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  actions?: Array<{ type: string; label: string; status: 'pending' | 'completed' | 'simulated' }>;
}

export default function Demo() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<'discovery' | 'strategy' | 'execution'>('discovery');
  const [userData, setUserData] = useState({
    industry: "",
    goal: "",
    budget: "",
    timeline: ""
  });
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [metrics, setMetrics] = useState(selectedAgent.metrics);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{
      id: '1',
      role: 'agent',
      content: `Hello! I'm ${selectedAgent.name}, your ${selectedAgent.title}. ${selectedAgent.description}. How can I help transform your business today?`,
      timestamp: new Date()
    }]);
    setMetrics(selectedAgent.metrics);
  }, [selectedAgent]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: generateAgentResponse(selectedAgent, inputValue, phase, isLiveMode),
        timestamp: new Date(),
        actions: generateActions(selectedAgent, phase, isLiveMode)
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
      
      // Update metrics
      updateMetrics();
      
      // Progress through phases
      if (phase === 'discovery' && messages.length > 2) {
        setPhase('strategy');
      } else if (phase === 'strategy' && messages.length > 5) {
        setPhase('execution');
      }
    }, 1500);
  };

  const generateAgentResponse = (agent: typeof agents[0], input: string, phase: string, live: boolean) => {
    const responses = {
      discovery: `Great question! Let me analyze your needs. Based on what you've shared, I can see several opportunities to ${agent.skills[0].toLowerCase()}. ${live ? "I'm connected to your live systems and ready to take action." : "I'll show you exactly what I can do in simulation mode."}`,
      strategy: `I've developed a comprehensive strategy for you. Here's my recommendation: We'll leverage ${agent.integrations[0]} to ${agent.skills[1].toLowerCase()}, which should improve your results by 40% within 30 days.`,
      execution: `${live ? "Executing your plan now..." : "Here's a simulation of what I'll do:"} I'm ${agent.skills[2].toLowerCase()} and will have everything ready within the next hour. You'll see the results in your dashboard.`
    };
    return responses[phase as keyof typeof responses] || responses.discovery;
  };

  const generateActions = (agent: typeof agents[0], phase: string, live: boolean) => {
    if (phase === 'execution') {
      return [
        { type: 'task', label: `${agent.skills[0]} initialized`, status: live ? 'completed' : 'simulated' as const },
        { type: 'integration', label: `Connected to ${agent.integrations[0]}`, status: live ? 'completed' : 'simulated' as const },
        { type: 'result', label: 'Generated output ready', status: 'pending' as const }
      ];
    }
    return undefined;
  };

  const updateMetrics = () => {
    setMetrics(prev => {
      const keys = Object.keys(prev);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      return { ...prev, [randomKey]: prev[randomKey as keyof typeof prev] + 1 };
    });
  };

  const handleAgentSwitch = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setPhase('discovery');
    setMessages([]);
  };

  const connectIntegration = (integration: string) => {
    if (isLiveMode) {
      setConnectedIntegrations(prev => 
        prev.includes(integration) 
          ? prev.filter(i => i !== integration)
          : [...prev, integration]
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Top Control Bar */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Agent Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {agents.map(agent => (
                <motion.button
                  key={agent.id}
                  onClick={() => handleAgentSwitch(agent)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap",
                    "border backdrop-blur-sm text-sm sm:text-base",
                    selectedAgent.id === agent.id
                      ? `${agent.bgColor} ${agent.borderColor} border-2`
                      : "border-white/10 hover:border-white/20 bg-white/5"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <agent.icon className="w-4 h-4" />
                  <span className="font-medium">{agent.name}</span>
                  {!agent.available && <Lock className="w-3 h-3 ml-1 opacity-50" />}
                </motion.button>
              ))}
            </div>

            {/* Mode Toggle & Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Label htmlFor="mode-toggle" className="text-xs sm:text-sm text-gray-400 hidden sm:inline">
                  Mode:
                </Label>
                <Switch
                  id="mode-toggle"
                  checked={isLiveMode}
                  onCheckedChange={setIsLiveMode}
                  disabled={connectedIntegrations.length === 0}
                />
                <Badge variant={isLiveMode ? "default" : "secondary"} className="text-xs">
                  {isLiveMode ? "LIVE" : "SIM"}
                </Badge>
              </div>
              
              <Button variant="ghost" size="sm" className="text-gray-400 hidden sm:inline-flex">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-400 hidden md:inline-flex">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Link href="/join">
                <Button className="bg-gradient-to-r from-harmony-gold to-yellow-500 text-black font-semibold text-sm sm:text-base">
                  Deploy Agent
                  <ArrowRight className="w-4 h-4 ml-2 hidden sm:inline" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 sm:gap-4 mt-3 overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              <Badge 
                variant={phase === 'discovery' ? 'default' : 'secondary'}
                className="text-xs"
              >
                Discovery
              </Badge>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <Badge 
                variant={phase === 'strategy' ? 'default' : 'secondary'}
                className="text-xs"
              >
                Strategy
              </Badge>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <Badge 
                variant={phase === 'execution' ? 'default' : 'secondary'}
                className="text-xs"
              >
                Execution
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
          {/* Left Panel - Chat Console */}
          <aside className="lg:col-span-4 min-w-0">
            <Card className="min-h-[500px] lg:h-[600px] bg-gray-900/50 border-white/10 flex flex-col">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", selectedAgent.bgColor)}>
                      <selectedAgent.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedAgent.name}</h3>
                      <p className="text-xs text-gray-400">{selectedAgent.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">Active</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4 min-h-0">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex",
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.role === 'user' 
                            ? 'bg-harmony-gold/20 text-harmony-gold border border-harmony-gold/30'
                            : `${selectedAgent.bgColor} border ${selectedAgent.borderColor}`
                        )}>
                          <p className="text-sm">{message.content}</p>
                          
                          {message.actions && (
                            <div className="mt-3 space-y-2">
                              {message.actions.map((action, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  {action.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                  {action.status === 'pending' && <Loader2 className="w-3 h-3 animate-spin" />}
                                  {action.status === 'simulated' && <AlertCircle className="w-3 h-3 text-yellow-500" />}
                                  <span className="opacity-80">{action.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{selectedAgent.name} is typing...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-gray-900/60 backdrop-blur">
                  {/* Quick Prompts */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {starterPrompts[selectedAgent.id as keyof typeof starterPrompts].slice(0, 2).map((prompt, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        size="sm"
                        className="text-xs border border-white/10"
                        onClick={() => setInputValue(prompt)}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {prompt.substring(0, 25)}...
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={`Ask ${selectedAgent.name} anything...`}
                      className="bg-gray-800/50 border-white/10"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-harmony-gold to-yellow-500 text-black"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Center Panel - Strategy Canvas */}
          <section className="lg:col-span-5 min-w-0">
            <Card className="min-h-[500px] lg:h-[600px] bg-gray-900/50 border-white/10 flex flex-col">
              <CardHeader className="border-b border-white/10">
                <h3 className="font-semibold">Strategy Canvas</h3>
                <p className="text-xs text-gray-400">Visual output and execution timeline</p>
              </CardHeader>
              
              <CardContent className="p-6">
                <Tabs defaultValue="strategy" className="h-full">
                  <TabsList className="bg-gray-800/50">
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="outputs">Outputs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="strategy" className="mt-4 space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                      <h4 className="font-medium mb-2">Current Objective</h4>
                      <p className="text-sm text-gray-400">
                        Optimize business operations using {selectedAgent.name}'s capabilities
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Recommended Actions</h4>
                      {selectedAgent.skills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-harmony-gold to-yellow-500 flex items-center justify-center text-black font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{skill}</p>
                            <p className="text-xs text-gray-400">Ready to implement</p>
                          </div>
                          <Button size="sm" variant="ghost">
                            <PlayCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="timeline" className="mt-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-harmony-gold to-transparent" />
                        
                        {['Week 1: Discovery', 'Week 2: Implementation', 'Week 3: Optimization', 'Week 4: Scale'].map((item, idx) => (
                          <div key={idx} className="relative flex items-center gap-4 mb-6">
                            <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-harmony-gold flex items-center justify-center z-10">
                              <span className="text-xs font-bold">{idx + 1}</span>
                            </div>
                            <div className="flex-1 p-3 rounded-lg bg-gray-800/50">
                              <p className="text-sm font-medium">{item}</p>
                              <Progress value={(idx + 1) * 25} className="mt-2 h-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="outputs" className="mt-4">
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-gray-800/50 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Strategy Document</span>
                          <Badge>PDF</Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          Complete analysis and recommendations
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gray-800/50 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Implementation Plan</span>
                          <Badge>XLSX</Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          Step-by-step execution roadmap
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Right Panel - Metrics & Actions */}
          <aside className="lg:col-span-3 min-w-0">
            <div className="space-y-4">
              {/* Live KPIs */}
              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <h3 className="font-semibold">Live Metrics</h3>
                  <p className="text-xs text-gray-400">Real-time performance indicators</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm capitalize">{key}</span>
                        <span className="text-lg font-bold text-harmony-gold">{value}</span>
                      </div>
                      <Progress value={Math.min(value * 10, 100)} className="h-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* User Context */}
              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <h3 className="font-semibold">Your Context</h3>
                  <p className="text-xs text-gray-400">Help agents understand your needs</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Industry</Label>
                    <Input
                      placeholder="e.g., SaaS, E-commerce"
                      className="mt-1 bg-gray-800/50 border-white/10 text-sm"
                      value={userData.industry}
                      onChange={(e) => setUserData({...userData, industry: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Primary Goal</Label>
                    <Input
                      placeholder="e.g., Increase sales by 50%"
                      className="mt-1 bg-gray-800/50 border-white/10 text-sm"
                      value={userData.goal}
                      onChange={(e) => setUserData({...userData, goal: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Budget Range</Label>
                    <Input
                      placeholder="e.g., $5k-10k/month"
                      className="mt-1 bg-gray-800/50 border-white/10 text-sm"
                      value={userData.budget}
                      onChange={(e) => setUserData({...userData, budget: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Integrations */}
              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <h3 className="font-semibold">Integrations</h3>
                  <p className="text-xs text-gray-400">Connect your tools for live mode</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedAgent.integrations.map((integration) => (
                    <button
                      key={integration}
                      onClick={() => connectIntegration(integration)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                        "border text-sm",
                        connectedIntegrations.includes(integration) && isLiveMode
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "bg-gray-800/50 border-white/10 hover:border-white/20"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {connectedIntegrations.includes(integration) && isLiveMode ? (
                          <Unlock className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4 opacity-50" />
                        )}
                        {integration}
                      </span>
                      {connectedIntegrations.includes(integration) && isLiveMode && (
                        <Badge variant="outline" className="text-xs">Connected</Badge>
                      )}
                    </button>
                  ))}
                  
                  {!isLiveMode && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Enable Live Mode to connect integrations
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* CTA */}
              <Link href="/join" className="block">
                <Button className="w-full bg-gradient-to-r from-harmony-gold to-yellow-500 text-black font-semibold py-6">
                  <Zap className="w-5 h-5 mr-2" />
                  Deploy {selectedAgent.name} to Your Dashboard
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Badge */}
      {!isLiveMode && (
        <div className="fixed bottom-8 left-8 z-50">
          <Badge className="px-4 py-2 bg-gray-900/90 border-yellow-500/30 text-yellow-500">
            <AlertCircle className="w-4 h-4 mr-2" />
            DEMO MODE - No real actions taken
          </Badge>
        </div>
      )}
    </main>
  );
}