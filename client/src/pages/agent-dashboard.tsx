import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TrendingUp, Phone, MessageCircle, Video, BarChart3, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeadData {
  leadName: string;
  businessType: string;
  painPoint: string;
  crmStage: string;
  lastContactDate?: string;
}

export default function AgentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [leadData, setLeadData] = useState<LeadData>({
    leadName: '',
    businessType: '',
    painPoint: '',
    crmStage: 'new'
  });

  const [showLoomScript, setShowLoomScript] = useState(false);

  // Get Cash Agent stats
  const { data: cashStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/agents/cash/stats'],
  });

  // Process lead mutation
  const processLeadMutation = useMutation({
    mutationFn: async (data: LeadData) => {
      const response = await fetch('/api/agents/cash/process-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to process lead');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Lead Processed Successfully",
        description: `CA$HFLOW has analyzed ${leadData.leadName} and provided recommendations.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/agents/cash/stats'] });
    },
    onError: (error) => {
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Generate Loom script mutation
  const generateLoomMutation = useMutation({
    mutationFn: async (data: LeadData) => {
      const response = await fetch('/api/agents/cash/generate-loom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to generate Loom script');
      return response.json();
    },
    onSuccess: () => {
      setShowLoomScript(true);
      toast({
        title: "Loom Script Generated",
        description: "CA$HFLOW has created a personalized video script.",
      });
    }
  });

  const handleProcessLead = () => {
    if (!leadData.leadName || !leadData.businessType || !leadData.painPoint) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before processing.",
        variant: "destructive",
      });
      return;
    }
    processLeadMutation.mutate(leadData);
  };

  const handleGenerateLoom = () => {
    if (!leadData.leadName || !leadData.businessType || !leadData.painPoint) {
      toast({
        title: "Missing Information",
        description: "Please fill in lead details to generate Loom script.",
        variant: "destructive",
      });
      return;
    }
    generateLoomMutation.mutate(leadData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 via-black to-yellow-500 flex items-center justify-center relative">
              <TrendingUp className="h-8 w-8 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-harmony-gold rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">CA$HFLOW Dashboard</h1>
              <p className="text-harmony-gold font-mono">Agent #001 • The Sales Hunter</p>
              <p className="text-gray-400 italic">"Let me handle this... you focus on delivery."</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lead Processing Form */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-harmony-gold/30">
            <CardHeader>
              <CardTitle className="text-harmony-gold flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Process New Lead</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Lead Name *</label>
                  <Input
                    placeholder="e.g., Sarah Johnson"
                    value={leadData.leadName}
                    onChange={(e) => setLeadData({...leadData, leadName: e.target.value})}
                    className="bg-slate-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Business Type *</label>
                  <Input
                    placeholder="e.g., MedSpa Clinic"
                    value={leadData.businessType}
                    onChange={(e) => setLeadData({...leadData, businessType: e.target.value})}
                    className="bg-slate-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Pain Point *</label>
                <Textarea
                  placeholder="e.g., Manual appointment follow-ups taking too much time"
                  value={leadData.painPoint}
                  onChange={(e) => setLeadData({...leadData, painPoint: e.target.value})}
                  className="bg-slate-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">CRM Stage</label>
                <select
                  value={leadData.crmStage}
                  onChange={(e) => setLeadData({...leadData, crmStage: e.target.value})}
                  className="w-full bg-slate-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal Sent</option>
                  <option value="negotiation">In Negotiation</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleProcessLead}
                  disabled={processLeadMutation.isPending}
                  className="bg-harmony-gold text-slate-900 hover:bg-yellow-400 flex-1"
                >
                  {processLeadMutation.isPending ? (
                    <span className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Process Lead</span>
                    </span>
                  )}
                </Button>
                
                <Button
                  onClick={handleGenerateLoom}
                  disabled={generateLoomMutation.isPending}
                  variant="outline"
                  className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold hover:text-slate-900"
                >
                  <Video className="h-4 w-4 mr-2" />
                  {generateLoomMutation.isPending ? 'Generating...' : 'Generate Loom'}
                </Button>
              </div>

              {/* Response Display */}
              {processLeadMutation.data && (
                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-harmony-gold/30">
                  <h4 className="text-harmony-gold font-semibold mb-2">CA$HFLOW Recommendation:</h4>
                  <p className="text-gray-300 mb-3">{processLeadMutation.data.response.message}</p>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-harmony-gold text-slate-900">
                      Action: {processLeadMutation.data.response.action.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="border-teal-400 text-teal-400">
                      Confidence: {processLeadMutation.data.response.confidence}%
                    </Badge>
                  </div>
                </div>
              )}

              {/* Loom Script Display */}
              {generateLoomMutation.data && showLoomScript && (
                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-harmony-gold/30">
                  <h4 className="text-harmony-gold font-semibold mb-2 flex items-center space-x-2">
                    <Video className="h-4 w-4" />
                    <span>Personalized Loom Script:</span>
                  </h4>
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                    {generateLoomMutation.data.script}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Panel */}
          <Card className="bg-slate-800/50 border-harmony-gold/30">
            <CardHeader>
              <CardTitle className="text-harmony-gold flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="text-center text-gray-400">Loading stats...</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-harmony-gold">{cashStats?.stats.totalLeadsProcessed || 0}</div>
                      <div className="text-xs text-gray-400">Leads Processed</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-teal-400">{cashStats?.stats.conversionRate || '85%'}</div>
                      <div className="text-xs text-gray-400">Conversion Rate</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Time:</span>
                      <span className="text-harmony-gold">{cashStats?.stats.averageResponseTime || '< 30s'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Today:</span>
                      <span className="text-teal-400">{cashStats?.stats.activeToday || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tokens Used:</span>
                      <span className="text-gray-300">{cashStats?.stats.totalTokensUsed || 0}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Recent Activity</h5>
                    {cashStats?.recentTasks?.length > 0 ? (
                      <div className="space-y-2">
                        {cashStats.recentTasks.slice(0, 3).map((task: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-teal-400" />
                            <span className="text-gray-400 truncate">{task.description}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No recent activity</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}