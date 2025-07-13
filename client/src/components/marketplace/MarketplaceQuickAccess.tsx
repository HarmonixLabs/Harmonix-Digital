import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Search, 
  Filter, 
  Grid, 
  List,
  Star,
  TrendingUp,
  Crown,
  Sparkles,
  ShoppingCart,
  Bot,
  DollarSign,
  Users,
  Calendar,
  Settings
} from 'lucide-react';
import { Link } from 'wouter';

interface QuickAccessButton {
  id: string;
  label: string;
  icon: React.ElementType;
  category?: string;
  action?: () => void;
  badge?: string;
  color: string;
}

export function MarketplaceQuickAccess() {
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

  const quickAccessButtons: QuickAccessButton[] = [
    {
      id: 'featured',
      label: 'Featured Agents',
      icon: Star,
      badge: 'Hot',
      color: 'bg-gradient-to-r from-amber-500 to-orange-500'
    },
    {
      id: 'trending',
      label: 'Trending',
      icon: TrendingUp,
      badge: '🔥',
      color: 'bg-gradient-to-r from-red-500 to-pink-500'
    },
    {
      id: 'premium',
      label: 'Premium',
      icon: Crown,
      badge: 'VIP',
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500'
    },
    {
      id: 'new',
      label: 'New Releases',
      icon: Sparkles,
      badge: 'New',
      color: 'bg-gradient-to-r from-green-500 to-teal-500'
    },
    {
      id: 'sales',
      label: 'Sales Agents',
      icon: DollarSign,
      category: 'sales',
      color: 'bg-gradient-to-r from-emerald-500 to-green-600'
    },
    {
      id: 'support',
      label: 'Support Agents',
      icon: Users,
      category: 'support',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: Bot,
      category: 'automation',
      color: 'bg-gradient-to-r from-slate-500 to-gray-600'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: Calendar,
      category: 'analytics',
      color: 'bg-gradient-to-r from-violet-500 to-purple-600'
    }
  ];

  const viewToggleButtons = [
    { id: 'grid', icon: Grid, label: 'Grid View' },
    { id: 'list', icon: List, label: 'List View' }
  ];

  return (
    <Card className="bg-harmony-dark/50 border-jade-forest/30 backdrop-blur-md">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-jade-forest to-harmonix-gold flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-jade-forest">Quick Access</h3>
              <p className="text-sm text-jade-forest/70">Navigate the marketplace faster</p>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            {viewToggleButtons.map((view) => {
              const Icon = view.icon;
              return (
                <Button
                  key={view.id}
                  variant={activeView === view.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView(view.id as 'grid' | 'list')}
                  className={`
                    ${activeView === view.id 
                      ? 'bg-jade-forest text-white' 
                      : 'text-jade-forest hover:bg-jade-forest/10'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className={`
          grid gap-3 
          ${activeView === 'grid' 
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1'
          }
        `}>
          {quickAccessButtons.map((button) => {
            const Icon = button.icon;
            return (
              <Link key={button.id} href={`/marketplace?filter=${button.category || button.id}`}>
                <Button
                  variant="ghost"
                  className={`
                    relative h-auto p-4 flex-col items-center justify-center space-y-2
                    bg-harmony-dark/30 hover:bg-harmony-dark/50 border border-jade-forest/20
                    hover:border-jade-forest/40 transition-all duration-300 group
                    ${activeView === 'list' ? 'flex-row space-y-0 space-x-3 justify-start' : ''}
                  `}
                >
                  {/* Icon with gradient background */}
                  <div className={`
                    w-10 h-10 rounded-xl ${button.color} 
                    flex items-center justify-center shadow-lg
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Label and Badge */}
                  <div className={`
                    ${activeView === 'list' ? 'flex items-center justify-between flex-1' : 'text-center'}
                  `}>
                    <span className="text-sm font-medium text-jade-forest group-hover:text-harmonix-gold transition-colors">
                      {button.label}
                    </span>
                    
                    {button.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`
                          bg-harmonix-gold/20 text-harmonix-gold border-harmonix-gold/30 text-xs
                          ${activeView === 'grid' ? 'mt-1' : 'ml-2'}
                        `}
                      >
                        {button.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-jade-forest/0 via-jade-forest/5 to-harmonix-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Search and Filter Quick Actions */}
        <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-jade-forest/20">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-jade-forest/30 text-jade-forest hover:bg-jade-forest/10"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Agents
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-jade-forest/30 text-jade-forest hover:bg-jade-forest/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          
          <Link href="/marketplace?view=create">
            <Button
              size="sm"
              className="bg-harmonix-gold hover:bg-harmonix-gold/90 text-harmony-dark"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse All
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}