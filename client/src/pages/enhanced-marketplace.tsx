import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Zap, 
  Star, 
  Users, 
  TrendingUp,
  Plus,
  Shield,
  Clock,
  Crown,
  Sparkles,
  Bot,
  DollarSign,
  Gem
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OneClickMarketplace } from '@/components/one-click-marketplace';

export default function EnhancedMarketplace() {
  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      {/* Hero Section */}
      <div className="bg-harmonix-night-pine border-b border-harmonix-sage-fade/20">
        <div className="responsive-container py-8 md:py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Zap className="h-8 w-8 md:h-12 md:w-12 text-harmonix-regal-gold" />
              <h1 className="text-responsive-3xl font-bold text-harmonix-regal-gold">
                Agent Marketplace
              </h1>
            </div>
            
            <p className="text-responsive-lg text-harmonix-sage-fade/70 mb-6 md:mb-8 px-4 md:px-0">
              Deploy powerful AI agents with one click. No technical setup required.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-harmonix-regal-gold mx-auto mb-2" />
                <p className="text-responsive-sm text-harmonix-sage-fade">
                  <span className="font-semibold">5-minute</span> deployment
                </p>
              </div>
              
              <div className="text-center p-4">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-harmonix-regal-gold mx-auto mb-2" />
                <p className="text-responsive-sm text-harmonix-sage-fade">
                  <span className="font-semibold">30-day</span> guarantee
                </p>
              </div>
              
              <div className="text-center p-4">
                <Star className="h-6 w-6 md:h-8 md:w-8 text-harmonix-regal-gold mx-auto mb-2" />
                <p className="text-responsive-sm text-harmonix-sage-fade">
                  <span className="font-semibold">4.8+</span> avg rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-container py-6 md:py-8">
        <Tabs defaultValue="featured" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
            <TabsTrigger value="featured" className="flex items-center justify-center gap-1 md:gap-2 min-h-[44px] text-responsive-sm">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Featured</span>
              <span className="sm:hidden">Featured</span>
            </TabsTrigger>
            <TabsTrigger value="bestsellers" className="flex items-center justify-center gap-1 md:gap-2 min-h-[44px] text-responsive-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Best Sellers</span>
              <span className="sm:hidden">Best</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center justify-center gap-1 md:gap-2 min-h-[44px] text-responsive-sm">
              <Sparkles className="h-4 w-4" />
              New
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center justify-center gap-1 md:gap-2 min-h-[44px] text-responsive-sm">
              <Plus className="h-4 w-4" />
              Create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-6 w-6 text-harmonix-regal-gold" />
                <h2 className="text-2xl font-bold text-harmonix-regal-gold">
                  Featured Agents
                </h2>
                <Badge variant="secondary">Ready for instant deployment</Badge>
              </div>
              <p className="text-harmonix-sage-fade/70">
                Handpicked premium agents trusted by thousands of organizations
              </p>
            </div>
            
            <OneClickMarketplace showHeader={false} />
          </TabsContent>

          <TabsContent value="bestsellers">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-harmonix-regal-gold" />
                <h2 className="text-2xl font-bold text-harmonix-regal-gold">
                  Best Selling Agents
                </h2>
                <Badge variant="secondary">Most deployed this month</Badge>
              </div>
              <p className="text-harmonix-sage-fade/70">
                Top-performing agents with proven ROI and user satisfaction
              </p>
            </div>
            
            <OneClickMarketplace showHeader={false} />
          </TabsContent>

          <TabsContent value="new">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-harmonix-regal-gold" />
                <h2 className="text-2xl font-bold text-harmonix-regal-gold">
                  New Releases
                </h2>
                <Badge variant="secondary">Latest additions</Badge>
              </div>
              <p className="text-harmonix-sage-fade/70">
                Fresh agents with cutting-edge capabilities and features
              </p>
            </div>
            
            <OneClickMarketplace showHeader={false} maxItems={6} />
          </TabsContent>

          <TabsContent value="create">
            <div className="text-center py-12">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Sparkles className="h-16 w-16 text-harmonix-regal-gold mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-harmonix-regal-gold mb-4">
                    Creator Economy
                  </h2>
                  <p className="text-xl text-harmonix-sage-fade/70 mb-8">
                    Build and monetize your own AI agents with our comprehensive creator tools
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 text-center">
                    <CardContent className="p-6">
                      <Bot className="h-12 w-12 text-harmonix-regal-gold mx-auto mb-4" />
                      <h4 className="text-harmonix-sage-fade font-semibold mb-2">Create Agents</h4>
                      <p className="text-harmonix-sage-fade/70 text-sm">
                        Build custom AI agents with our visual flow designer
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 text-center">
                    <CardContent className="p-6">
                      <DollarSign className="h-12 w-12 text-harmonix-regal-gold mx-auto mb-4" />
                      <h4 className="text-harmonix-sage-fade font-semibold mb-2">Earn Revenue</h4>
                      <p className="text-harmonix-sage-fade/70 text-sm">
                        70% revenue share from agent deployments and usage
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 text-center">
                    <CardContent className="p-6">
                      <Gem className="h-12 w-12 text-harmonix-regal-gold mx-auto mb-4" />
                      <h4 className="text-harmonix-sage-fade font-semibold mb-2">Mint NFTs</h4>
                      <p className="text-harmonix-sage-fade/70 text-sm">
                        Create tradeable NFTs with royalty splits and ownership
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-harmonix-cedar-green/10 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-harmonix-sage-fade mb-4">
                    Creator Membership Tiers
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="font-semibold text-harmonix-sage-fade">Starter</p>
                      <p className="text-2xl font-bold text-harmonix-regal-gold">$30</p>
                      <p className="text-sm text-harmonix-sage-fade/70">1 agent</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-harmonix-sage-fade">Growth</p>
                      <p className="text-2xl font-bold text-harmonix-regal-gold">$99</p>
                      <p className="text-sm text-harmonix-sage-fade/70">5 agents</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-harmonix-sage-fade">Pro</p>
                      <p className="text-2xl font-bold text-harmonix-regal-gold">$299</p>
                      <p className="text-sm text-harmonix-sage-fade/70">20 agents</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-harmonix-sage-fade">Enterprise</p>
                      <p className="text-2xl font-bold text-harmonix-regal-gold">$999</p>
                      <p className="text-sm text-harmonix-sage-fade/70">unlimited</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/agent-builder">
                    <Button className="bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90" size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Start Building Agents
                    </Button>
                  </Link>
                  
                  <Link href="/creator-dashboard">
                    <Button variant="outline" size="lg" className="text-harmonix-sage-fade">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Creator Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}