import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PlatformLayout } from "@/components/layout/platform-layout";
import { 
  AgentPerformanceWidget,
  TaskCompletionWidget,
  EnergyMeterWidget,
  AchievementWidget,
  QuickStatsWidget
} from "@/components/ui/personalized-widgets";
import { AILoadingSkeleton } from "@/components/ui/ai-loading-skeleton";
import { AITooltip } from "@/components/ui/ai-tooltip-system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { motion } from 'framer-motion';
import { 
  UserRoundCheck, 
  Clock, 
  CheckCircle, 
  Activity, 
  BarChart3, 
  Users, 
  Zap, 
  Crown,
  Plus,
  Settings,
  TrendingUp
} from "lucide-react";

export default function EnhancedDashboard() {
  const { user } = useAuth();
  const [activeAgents, setActiveAgents] = useState(3);
  const [completedTasks, setCompletedTasks] = useState(47);

  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/agents'],
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/analytics/stats'],
  });

  if (!user) {
    return (
      <PlatformLayout showFeatures={true} enableSelfHealing={true}>
        <div className="min-h-screen harmonix-gradient flex items-center justify-center">
          <AILoadingSkeleton 
            variant="harmonix" 
            message="Loading your AI command center..."
            progress={75}
          />
        </div>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout showFeatures={true} enableSelfHealing={true}>
      <div className="min-h-screen harmonix-gradient">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Enhanced Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-jade-forest mb-2">
                  Welcome back, {user.firstName || 'Agent Commander'}
                </h1>
                <p className="text-harmonix-sage/70">
                  Your AI agents are ready to serve. Command your digital empire.
                </p>
              </div>
              
              <AITooltip
                content="Access advanced settings and configurations for your AI agents"
                personality="harmonix"
                position="left"
              >
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </AITooltip>
            </div>
            
            {/* Quick Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 mb-8"
            >
              <AITooltip
                content="Deploy a new AI agent to expand your automation capabilities"
                personality="cash"
                position="top"
              >
                <Button className="flex items-center gap-2 bg-jade-forest hover:bg-jade-forest/90">
                  <Plus className="w-4 h-4" />
                  Deploy Agent
                </Button>
              </AITooltip>
              
              <AITooltip
                content="View detailed analytics and performance metrics for all your agents"
                personality="sol"
                position="top"
              >
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
              </AITooltip>
              
              <AITooltip
                content="Monitor real-time activity and task execution across your agent network"
                personality="atlas"
                position="top"
              >
                <Button variant="outline" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Live Activity
                </Button>
              </AITooltip>
            </motion.div>
          </motion.div>

          {/* Interactive Dashboard Widgets Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AgentPerformanceWidget />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TaskCompletionWidget />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <EnergyMeterWidget />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <AchievementWidget />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <QuickStatsWidget />
            </motion.div>
          </motion.div>

          {/* Enhanced Agent Status Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            <Card className="bg-harmonix-night border-harmonix-sage/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-jade-forest">
                  <Users className="w-5 h-5" />
                  Active Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agentsLoading ? (
                  <AILoadingSkeleton 
                    variant="grace" 
                    message="Loading your agent team..."
                    progress={60}
                  />
                ) : (
                  <div className="space-y-4">
                    {[
                      { name: 'Agent CA$H', status: 'active', task: 'Processing leads' },
                      { name: 'Grace Concierge', status: 'active', task: 'Customer support' },
                      { name: 'Atlas Project Manager', status: 'idle', task: 'Awaiting instructions' }
                    ].map((agent, index) => (
                      <AITooltip
                        key={agent.name}
                        content={`${agent.name} is currently ${agent.status === 'active' ? 'working on' : 'ready for'} ${agent.task.toLowerCase()}`}
                        personality={agent.name.includes('CA$H') ? 'cash' : agent.name.includes('Grace') ? 'grace' : 'atlas'}
                        position="right"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-harmonix-sage/5 hover:bg-harmonix-sage/10 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                            <div>
                              <p className="font-medium text-harmonix-sage">{agent.name}</p>
                              <p className="text-sm text-harmonix-sage/60">{agent.task}</p>
                            </div>
                          </div>
                          <CheckCircle className="w-4 h-4 text-jade-forest" />
                        </motion.div>
                      </AITooltip>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-harmonix-night border-harmonix-sage/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-jade-forest">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <AILoadingSkeleton 
                    variant="sol" 
                    message="SŌL is analyzing recent activities..."
                    progress={80}
                  />
                ) : (
                  <div className="space-y-4">
                    {[
                      { task: 'Lead qualified and added to CRM', time: '2 minutes ago', agent: 'CA$H' },
                      { task: 'Email campaign sent successfully', time: '15 minutes ago', agent: 'Grace' },
                      { task: 'Project milestone completed', time: '1 hour ago', agent: 'Atlas' }
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-harmonix-sage/5"
                      >
                        <div className="w-2 h-2 rounded-full bg-jade-forest mt-2" />
                        <div className="flex-1">
                          <p className="text-sm text-harmonix-sage">{activity.task}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-harmonix-sage/60">{activity.time}</span>
                            <span className="text-xs text-jade-forest">by {activity.agent}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Deploy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-r from-jade-forest/20 to-harmonix-sage/10 rounded-xl p-6 border border-jade-forest/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-jade-forest mb-2">
                  Ready to Scale Your AI Empire?
                </h3>
                <p className="text-harmonix-sage/70">
                  Deploy specialized agents to automate more of your business processes
                </p>
              </div>
              
              <AITooltip
                content="Explore our agent marketplace to find the perfect AI assistant for your needs"
                personality="harmonix"
                position="left"
                contextual
              >
                <Button className="bg-jade-forest hover:bg-jade-forest/90 text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  Browse Marketplace
                </Button>
              </AITooltip>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </PlatformLayout>
  );
}