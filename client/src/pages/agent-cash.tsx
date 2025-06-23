import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Target, MessageSquare, Phone, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AgentCash() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [taskInput, setTaskInput] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [businessType, setBusinessType] = useState("");

  const { data: cashAgent, isLoading: agentLoading } = useQuery({
    queryKey: ['/api/agents'],
    enabled: !!user
  });

  const { data: recentTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
    enabled: !!user
  });

  const deployTaskMutation = useMutation({
    mutationFn: async (data: { description: string; leadInfo?: any }) => {
      return apiRequest('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: 'CA$H Sales Task',
          description: data.description,
          agentId: cashAgent?.id,
          metadata: data.leadInfo
        })
      });
    },
    onSuccess: () => {
      toast({ title: "Task deployed to CA$H", description: "Your sales task is now being processed" });
      setTaskInput("");
      setLeadName("");
      setLeadEmail("");
      setBusinessType("");
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
    onError: () => {
      toast({ title: "Deployment failed", description: "Could not deploy task to CA$H", variant: "destructive" });
    }
  });

  const handleQuickAction = (action: string) => {
    const tasks = {
      'follow_up': 'Follow up with recent leads who haven\'t responded in 3+ days',
      'qualify_leads': 'Review and qualify new leads from this week',
      'crm_update': 'Update CRM with latest contact interactions and next steps',
      'pipeline_review': 'Analyze sales pipeline and recommend priority actions'
    };
    
    deployTaskMutation.mutate({ description: tasks[action as keyof typeof tasks] });
  };

  const handleLeadTask = () => {
    if (!leadName || !taskInput) return;
    
    const leadInfo = {
      name: leadName,
      email: leadEmail,
      businessType: businessType
    };
    
    deployTaskMutation.mutate({ 
      description: `${taskInput} for lead: ${leadName}`,
      leadInfo 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-gray-400 mb-6">Please log in to access Agent CA$H</p>
          <Button className="bg-harmony-gold hover:bg-yellow-500 text-harmony-dark">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agent Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-red-500 via-black to-yellow-500 flex items-center justify-center relative overflow-hidden">
                <TrendingUp className="h-12 w-12 text-white z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-harmony-gold rounded-full animate-pulse border-2 border-black"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                LIVE
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-5xl font-bold">CA$HFLOW</h1>
                <Badge className="bg-harmony-gold text-harmony-dark font-bold">FLAGSHIP</Badge>
              </div>
              <p className="text-harmony-gold font-mono text-lg mb-1">Agent #001 • The Sales Hunter</p>
              <p className="text-gray-300 text-lg mb-2">Red/Black Luxury Techwear • Diamond Chain</p>
              <p className="text-gray-400 italic">"Let me handle this... you focus on delivery."</p>
            </div>

            <div className="text-right space-y-2">
              <div className="text-sm text-gray-400">Performance</div>
              <div className="text-3xl font-bold harmony-gold">+85%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 max-w-3xl">
            Your revenue assistant. Fast but never rushed, confident without ego. 
            Let CA$H handle lead generation, follow-ups, and CRM management while you focus on delivery.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-harmony-gold" />
                  <span>Quick Sales Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left border-gray-700 hover:border-harmony-gold"
                    onClick={() => handleQuickAction('follow_up')}
                    disabled={deployTaskMutation.isPending}
                  >
                    <div>
                      <div className="font-semibold flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Follow Up Leads</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Chase recent leads who haven't responded
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left border-gray-700 hover:border-harmony-gold"
                    onClick={() => handleQuickAction('qualify_leads')}
                    disabled={deployTaskMutation.isPending}
                  >
                    <div>
                      <div className="font-semibold flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>Qualify New Leads</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Review and score this week's leads
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left border-gray-700 hover:border-harmony-gold"
                    onClick={() => handleQuickAction('crm_update')}
                    disabled={deployTaskMutation.isPending}
                  >
                    <div>
                      <div className="font-semibold flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Update CRM</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Sync recent interactions and notes
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left border-gray-700 hover:border-harmony-gold"
                    onClick={() => handleQuickAction('pipeline_review')}
                    disabled={deployTaskMutation.isPending}
                  >
                    <div>
                      <div className="font-semibold flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Pipeline Review</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Analyze and prioritize sales opportunities
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Custom Task Input */}
            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle>Deploy Custom Sales Task</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input
                    placeholder="Lead name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                  />
                  <Input
                    placeholder="Email (optional)"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Business type"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  />
                </div>
                
                <Textarea
                  placeholder="Describe the sales task for CA$H..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  rows={3}
                />
                
                <Button 
                  onClick={handleLeadTask}
                  disabled={!taskInput || !leadName || deployTaskMutation.isPending}
                  className="bg-harmony-gold hover:bg-yellow-500 text-harmony-dark"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {deployTaskMutation.isPending ? "Deploying..." : "Deploy to CA$H"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Agent Stats & Recent Activity */}
          <div className="space-y-6">
            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle>CA$H Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Conversion Rate</span>
                      <span className="text-harmony-gold">85%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div className="bg-harmony-gold h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Response Time</span>
                      <span className="text-green-400">&lt; 2 min</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tasks Completed</span>
                      <span className="text-blue-400">247</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-800 h-12 rounded"></div>
                    ))}
                  </div>
                ) : recentTasks.length === 0 ? (
                  <p className="text-gray-400 text-sm">No recent tasks</p>
                ) : (
                  <div className="space-y-3">
                    {recentTasks.slice(0, 5).map((task: any) => (
                      <div key={task.id} className="text-sm">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-gray-400 text-xs">{task.status}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}