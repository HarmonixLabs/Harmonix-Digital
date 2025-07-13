import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, Send, Sparkles, Zap, TrendingUp, Users, 
  DollarSign, AlertCircle, CheckCircle, HelpCircle,
  BarChart3, Cpu, MessageSquare, Activity
} from 'lucide-react';

interface SolMessage {
  id: string;
  type: 'user' | 'sol';
  content: string;
  timestamp: Date;
  actionItems?: string[];
}

const mockMessages: SolMessage[] = [
  {
    id: '1',
    type: 'sol',
    content: "Good morning! I've analyzed your organization's performance. You have 3 high-priority items that need attention today.",
    timestamp: new Date(Date.now() - 3600000),
    actionItems: [
      'Review CA$H agent performance - conversion rate dropped 5%',
      'Approve 2 content pieces scheduled for tomorrow',
      'Respond to enterprise client inquiry'
    ]
  },
  {
    id: '2',
    type: 'user',
    content: "Which agent should I deploy for outbound sales to SaaS companies?",
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: '3',
    type: 'sol',
    content: "Based on your requirements, I recommend deploying CA$H with the 'Enterprise SaaS' configuration. CA$H has a 78% success rate with SaaS companies and specializes in technical decision-makers. Would you like me to deploy it now?",
    timestamp: new Date(Date.now() - 1200000)
  }
];

const quickActions = [
  { icon: <Cpu className="h-4 w-4" />, label: "Deploy Agent", action: "deploy" },
  { icon: <BarChart3 className="h-4 w-4" />, label: "Show ROI", action: "roi" },
  { icon: <Users className="h-4 w-4" />, label: "Team Stats", action: "team" },
  { icon: <AlertCircle className="h-4 w-4" />, label: "Issues", action: "issues" }
];

const insights = [
  {
    type: 'performance',
    title: 'Agent Performance Alert',
    description: 'ECHO engagement rate up 23% this week',
    icon: <TrendingUp className="h-5 w-5 text-green-600" />,
    priority: 'low'
  },
  {
    type: 'opportunity',
    title: 'Revenue Opportunity',
    description: '5 leads in pipeline worth $45K need follow-up',
    icon: <DollarSign className="h-5 w-5 text-yellow-600" />,
    priority: 'high'
  },
  {
    type: 'recommendation',
    title: 'Recommended Action',
    description: 'Deploy FLOW agent to handle HR tasks backlog',
    icon: <Sparkles className="h-5 w-5 text-purple-600" />,
    priority: 'medium'
  }
];

export default function SolBrainCenter() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<SolMessage[]>(mockMessages);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage: SolMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages([...messages, newUserMessage]);
    setMessage('');

    // Simulate SOL response
    setTimeout(() => {
      const solResponse: SolMessage = {
        id: (Date.now() + 1).toString(),
        type: 'sol',
        content: "I'm analyzing your request and gathering relevant data. Here's what I found...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, solResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">SŌL Brain Center</h2>
            <p className="text-muted-foreground">Your AI command center and orchestrator</p>
          </div>
        </div>
        <Badge variant="outline" className="animate-pulse">
          <Activity className="h-3 w-3 mr-1" />
          Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ask Harmony Anything</CardTitle>
              <CardDescription>
                Get insights, deploy agents, and manage your operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        {msg.actionItems && (
                          <ul className="mt-3 space-y-1">
                            {msg.actionItems.map((item, index) => (
                              <li key={index} className="text-xs flex items-start">
                                <CheckCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="text-xs opacity-70 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(action.label)}
                  >
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </Button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Example Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Example Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => setMessage("Which agent should I deploy for outbound sales?")}
                >
                  <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  Which agent for sales?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => setMessage("Show me this week's ROI by agent")}
                >
                  <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                  Weekly ROI report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => setMessage("Who's the top performing content creator?")}
                >
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  Top performers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => setMessage("Deploy GRACE for customer support")}
                >
                  <Cpu className="h-4 w-4 mr-2 flex-shrink-0" />
                  Deploy agent
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Insights</CardTitle>
              <CardDescription>
                Proactive recommendations from SŌL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      {insight.icon}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Zap className="h-3 w-3 mr-1" />
                    Take Action
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">All Agents</span>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <span className="text-sm font-medium">124ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily Queries</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Powers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Cpu className="h-4 w-4 mr-2" />
                Deploy Agent
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard Upgrade
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Route to Agent
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertCircle className="h-4 w-4 mr-2" />
                View Red Flags
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}