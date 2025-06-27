import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  MessageSquare, 
  Clock, 
  Zap, 
  Star,
  ArrowRight,
  Sparkles,
  Bot,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DemoSuite = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [demoSession, setDemoSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAgents = [
    {
      id: 'sales',
      name: 'Sales Agent',
      icon: '💼',
      description: 'AI-powered sales assistant that finds leads, follows up with prospects, and closes deals automatically.',
      color: 'from-blue-500 to-blue-600',
      demoScenarios: [
        'Lead qualification and scoring',
        'Automated follow-up sequences',
        'Deal pipeline management',
        'Sales analytics and reporting'
      ],
      sampleData: {
        leads: 45,
        conversion_rate: '23%',
        pipeline_value: '$125,000'
      }
    },
    {
      id: 'marketing',
      name: 'Marketing Agent',
      icon: '📈',
      description: 'Creates compelling content, manages campaigns, and drives customer acquisition across all channels.',
      color: 'from-purple-500 to-purple-600',
      demoScenarios: [
        'Content creation and optimization',
        'Social media management',
        'Campaign performance tracking',
        'SEO and keyword analysis'
      ],
      sampleData: {
        campaigns: 12,
        engagement_rate: '4.2%',
        content_pieces: 89
      }
    },
    {
      id: 'support',
      name: 'Customer Support Agent',
      icon: '🎧',
      description: 'Provides 24/7 customer support, handles inquiries, and resolves issues with human-like empathy.',
      color: 'from-green-500 to-green-600',
      demoScenarios: [
        'Ticket resolution and routing',
        'Customer sentiment analysis',
        'Knowledge base integration',
        'Escalation management'
      ],
      sampleData: {
        tickets_resolved: 234,
        satisfaction_score: '4.8/5',
        response_time: '2 min'
      }
    },
    {
      id: 'hr',
      name: 'HR Agent',
      icon: '👥',
      description: 'Streamlines recruitment, onboarding, and employee management with intelligent automation.',
      color: 'from-orange-500 to-orange-600',
      demoScenarios: [
        'Candidate screening and matching',
        'Interview scheduling',
        'Onboarding automation',
        'Performance tracking'
      ],
      sampleData: {
        candidates: 67,
        time_to_hire: '18 days',
        satisfaction: '92%'
      }
    }
  ];

  const startDemo = async (agent) => {
    setIsLoading(true);
    setSelectedAgent(agent);
    
    try {
      // Simulate API call to start demo session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const session = {
        id: `demo_${Date.now()}`,
        agent_id: agent.id,
        messages_used: 0,
        messages_limit: 5,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      setDemoSession(session);
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm the ${agent.name} demo. I'm here to show you how I can help streamline your ${agent.id} operations. What would you like to explore first?`,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to start demo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !demoSession) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = generateDemoResponse(inputMessage, selectedAgent, demoSession.messages_used + 1);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setDemoSession(prev => ({
        ...prev,
        messages_used: prev.messages_used + 1
      }));

    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoResponse = (input, agent, messageCount) => {
    const responses = {
      sales: [
        "I've analyzed your sales pipeline and identified 3 high-priority leads that are ready for immediate follow-up. Would you like me to draft personalized outreach messages?",
        "Based on your CRM data, I can see opportunities to increase your conversion rate by 15%. I recommend focusing on enterprise clients in the tech sector.",
        "I've created an automated follow-up sequence for your warm leads. The projected close rate for this quarter is looking strong at 28%.",
        "Perfect! I've updated your sales dashboard with real-time metrics. Your pipeline value has increased by $45,000 this week.",
        "Excellent progress! I've scheduled follow-up calls with your top prospects and prepared talking points based on their company research."
      ],
      marketing: [
        "I've generated 5 content ideas that align with your brand voice and current trends. These should drive 25% higher engagement based on similar campaigns.",
        "Your social media performance is trending upward! I've optimized your posting schedule and hashtag strategy for maximum reach.",
        "I've created a multi-channel campaign that targets your ideal customer profile. Expected ROI is 340% based on historical data.",
        "Great insight! I've incorporated this into our content calendar and scheduled posts across all platforms for the next two weeks.",
        "Your campaign performance is exceeding expectations! Engagement is up 42% and we're seeing strong conversion rates."
      ],
      support: [
        "I've categorized your support tickets and identified the top 3 issues affecting customer satisfaction. I can provide solutions for each.",
        "Your customer satisfaction score has improved to 4.8/5! I've implemented proactive support measures that reduced response time by 60%.",
        "I've analyzed customer feedback and created a knowledge base article that should resolve 80% of similar inquiries automatically.",
        "Excellent! I've escalated the complex issues to your team and resolved 15 tickets automatically using our AI-powered solutions.",
        "Your support metrics are outstanding! Average resolution time is down to 2 minutes and customer satisfaction remains high."
      ],
      hr: [
        "I've screened 25 candidates and identified 5 perfect matches for your open positions. Would you like me to schedule initial interviews?",
        "Your hiring process efficiency has improved by 40%! I've automated candidate communications and streamlined the interview pipeline.",
        "I've created personalized onboarding plans for your new hires based on their roles and experience levels.",
        "Great news! I've reduced your time-to-hire to 18 days and improved candidate satisfaction scores to 92%.",
        "Your HR metrics are impressive! Employee retention is up 15% and the onboarding process is running smoothly."
      ]
    };

    const agentResponses = responses[agent.id] || responses.sales;
    const responseIndex = Math.min(messageCount - 1, agentResponses.length - 1);
    return agentResponses[responseIndex];
  };

  const resetDemo = () => {
    setSelectedAgent(null);
    setDemoSession(null);
    setMessages([]);
    setInputMessage('');
  };

  if (selectedAgent && demoSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Demo Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 bg-gradient-to-r ${selectedAgent.color} rounded-xl`}>
                  <span className="text-2xl">{selectedAgent.icon}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {selectedAgent.name} Demo
                  </h1>
                  <p className="text-slate-400">Interactive demonstration session</p>
                </div>
              </div>
              <Button 
                onClick={resetDemo}
                variant="outline"
                className="border-slate-600 text-slate-400 hover:bg-slate-700"
              >
                End Demo
              </Button>
            </div>

            {/* Demo Progress */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Demo Progress</span>
                  <span className="text-sm text-slate-400">
                    {demoSession.messages_used}/{demoSession.messages_limit} messages used
                  </span>
                </div>
                <Progress 
                  value={(demoSession.messages_used / demoSession.messages_limit) * 100} 
                  className="h-2"
                />
                {demoSession.messages_used >= demoSession.messages_limit && (
                  <div className="mt-3 p-3 bg-emerald-900 border border-emerald-700 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-medium">Demo Complete!</span>
                    </div>
                    <p className="text-sm text-emerald-300 mt-1">
                      Ready to unlock unlimited conversations? Start your free trial now!
                    </p>
                    <Button 
                      className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      size="sm"
                    >
                      Start Free Trial
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700 h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-emerald-400 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Live Demo Chat
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-700 text-slate-100'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-700 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-slate-300">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder={demoSession.messages_used >= demoSession.messages_limit 
                        ? "Demo limit reached - Start trial for unlimited messages" 
                        : "Type your message..."
                      }
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={demoSession.messages_used >= demoSession.messages_limit || isLoading}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || demoSession.messages_used >= demoSession.messages_limit || isLoading}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Info Panel */}
            <div className="space-y-6">
              {/* Agent Stats */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Demo Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(selectedAgent.sampleData).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-slate-400 capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Demo Scenarios */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Try These Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedAgent.demoScenarios.map((scenario, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-3 text-slate-300 hover:bg-slate-700"
                        onClick={() => setInputMessage(scenario)}
                        disabled={demoSession.messages_used >= demoSession.messages_limit}
                      >
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">{scenario}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade CTA */}
              <Card className="bg-gradient-to-r from-emerald-900 to-teal-900 border-emerald-700">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Love what you see?
                  </h3>
                  <p className="text-emerald-200 text-sm mb-4">
                    Get unlimited access to all agents with advanced features and integrations.
                  </p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Demo Suite
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Experience the power of HARMONIX agents with interactive demos. 
            See how AI can transform your business operations in real-time.
          </p>
        </div>

        {/* Demo Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {demoAgents.map((agent) => (
            <Card key={agent.id} className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-4 bg-gradient-to-r ${agent.color} rounded-xl group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{agent.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">
                      {agent.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 mt-1">
                      Interactive Demo
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-slate-300">
                  {agent.description}
                </CardDescription>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-emerald-400">Demo Features:</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {agent.demoScenarios.slice(0, 2).map((scenario, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        <span>{scenario}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>5 min demo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>5 messages</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startDemo(agent)}
                    disabled={isLoading}
                    className={`bg-gradient-to-r ${agent.color} hover:opacity-90 text-white`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Start Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-600 rounded-lg w-fit mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Setup</h3>
              <p className="text-slate-400 text-sm">
                No configuration required. Start testing agents immediately with pre-loaded scenarios.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-600 rounded-lg w-fit mx-auto mb-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real AI Responses</h3>
              <p className="text-slate-400 text-sm">
                Experience actual AI-powered conversations with context-aware responses.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-600 rounded-lg w-fit mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Live Metrics</h3>
              <p className="text-slate-400 text-sm">
                See real-time performance data and understand the impact on your business.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoSuite;

