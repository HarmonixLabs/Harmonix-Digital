import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, DollarSign, Users, Clock, ArrowRight, 
  Package, FileText, Briefcase, Target, Activity
} from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  leads: number;
  value: number;
  conversion: number;
}

const salesPipeline: PipelineStage[] = [
  { id: 'qualified', name: 'Leads Qualified', leads: 45, value: 225000, conversion: 78 },
  { id: 'booked', name: 'Meetings Booked', leads: 35, value: 175000, conversion: 65 },
  { id: 'proposal', name: 'Proposal Sent', leads: 28, value: 140000, conversion: 80 },
  { id: 'negotiation', name: 'Negotiation', leads: 22, value: 110000, conversion: 85 },
  { id: 'closed', name: 'Closed Won', leads: 19, value: 95000, conversion: 100 }
];

const contentPipeline = [
  { id: 'draft', name: 'Draft', items: 12, status: 'pending' },
  { id: 'review', name: 'In Review', items: 8, status: 'review' },
  { id: 'approved', name: 'Approved', items: 5, status: 'approved' },
  { id: 'published', name: 'Published', items: 42, status: 'live' }
];

export default function PipelinesHub() {
  const [selectedPipeline, setSelectedPipeline] = useState('sales');

  const totalPipelineValue = salesPipeline.reduce((sum, stage) => sum + stage.value, 0);
  const avgConversion = salesPipeline.reduce((sum, stage) => sum + stage.conversion, 0) / salesPipeline.length;

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalPipelineValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +23% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversion.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Across all stages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time to Close</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 days</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              2 days faster
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Agent ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$48.5K</div>
            <p className="text-xs text-muted-foreground">Revenue generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Tabs */}
      <Tabs value={selectedPipeline} onValueChange={setSelectedPipeline} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
        </TabsList>

        {/* Sales Pipeline */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
              <CardDescription>
                Track leads through your sales process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pipeline Stages */}
                <div className="flex items-center justify-between overflow-x-auto pb-4">
                  {salesPipeline.map((stage, index) => (
                    <React.Fragment key={stage.id}>
                      <div className="flex-shrink-0 text-center">
                        <div className="relative">
                          <div className="w-32 p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">{stage.name}</h4>
                            <p className="text-2xl font-bold">{stage.leads}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              ${(stage.value / 1000).toFixed(0)}K
                            </p>
                            <Badge variant="outline" className="mt-2">
                              {stage.conversion}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {index < salesPipeline.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mx-2" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Stage Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Stage Performance</h4>
                  {salesPipeline.map((stage) => (
                    <div key={stage.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{stage.name}</span>
                        <span className="text-sm font-medium">
                          {stage.leads} leads • ${(stage.value / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <Progress value={stage.conversion} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Pipeline */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Pipeline</CardTitle>
              <CardDescription>
                Manage content creation and publishing workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {contentPipeline.map((stage) => (
                  <div key={stage.id} className="p-4 bg-muted rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">{stage.name}</h4>
                    <p className="text-2xl font-bold">{stage.items}</p>
                    <Badge 
                      variant={stage.status === 'live' ? 'default' : 
                              stage.status === 'approved' ? 'secondary' : 'outline'}
                      className="mt-2"
                    >
                      {stage.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Pipeline */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Pipeline</CardTitle>
              <CardDescription>
                Track project progress from planning to delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Project pipeline visualization coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agent Deployments */}
        <TabsContent value="deployments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Deployment Pipeline</CardTitle>
              <CardDescription>
                Monitor agent deployment lifecycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Deployment pipeline visualization coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CRM Pipeline */}
        <TabsContent value="crm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CRM Touchpoints</CardTitle>
              <CardDescription>
                Track customer engagement throughout the journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  CRM pipeline visualization coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agent ROI Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">💰</span>
                  </div>
                  <span className="font-medium">CA$H</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$32,500</p>
                  <p className="text-xs text-muted-foreground">67% of total</p>
                </div>
              </div>
              <Progress value={67} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">🌟</span>
                  </div>
                  <span className="font-medium">GRACE</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$12,000</p>
                  <p className="text-xs text-muted-foreground">25% of total</p>
                </div>
              </div>
              <Progress value={25} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">📱</span>
                  </div>
                  <span className="font-medium">ECHO</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$4,000</p>
                  <p className="text-xs text-muted-foreground">8% of total</p>
                </div>
              </div>
              <Progress value={8} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-semibold">342 tasks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Time/Task</span>
                <span className="font-semibold">2.4 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-semibold text-green-600">98.5%</span>
              </div>
              
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weekly Target</span>
                  <span>342/400</span>
                </div>
                <Progress value={85.5} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}