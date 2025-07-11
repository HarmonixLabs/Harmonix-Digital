import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  LayoutDashboard, 
  Store, 
  Palette, 
  Zap, 
  Users, 
  Settings, 
  BarChart3,
  Crown,
  Coins,
  Brain,
  Workflow,
  MessageSquare,
  Calendar,
  FileText,
  Shield
} from 'lucide-react'

const Sidebar = ({ isOpen }) => {
  const { user, organization } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { 
          name: 'Dashboard', 
          icon: LayoutDashboard, 
          path: '/dashboard',
          description: 'Overview & metrics'
        },
        { 
          name: 'Marketplace', 
          icon: Store, 
          path: '/marketplace',
          description: 'Discover agents'
        },
        { 
          name: 'My Agents', 
          icon: Zap, 
          path: '/agents',
          description: 'Manage deployments',
          badge: organization?.active_agents || 0
        }
      ]
    },
    {
      section: 'Tools',
      items: [
        { 
          name: 'SOL Orchestrator', 
          icon: Crown, 
          path: '/sol',
          description: 'AI workflow router',
          premium: true
        },
        { 
          name: 'Workflows', 
          icon: Workflow, 
          path: '/workflows',
          description: 'Multi-agent flows'
        },
        { 
          name: 'Analytics', 
          icon: BarChart3, 
          path: '/analytics',
          description: 'Performance insights'
        },
        { 
          name: 'Chat Hub', 
          icon: MessageSquare, 
          path: '/chat',
          description: 'Agent conversations'
        }
      ]
    },
    {
      section: 'Creator',
      items: [
        { 
          name: 'Creator Studio', 
          icon: Palette, 
          path: '/creator',
          description: 'Build agents',
          creatorOnly: true
        },
        { 
          name: 'Agent Builder', 
          icon: Brain, 
          path: '/builder',
          description: 'Visual editor',
          creatorOnly: true
        },
        { 
          name: 'Revenue', 
          icon: Coins, 
          path: '/revenue',
          description: 'Earnings & payouts',
          creatorOnly: true
        }
      ]
    },
    {
      section: 'Organization',
      items: [
        { 
          name: 'Team', 
          icon: Users, 
          path: '/team',
          description: 'Manage members'
        },
        { 
          name: 'Billing', 
          icon: FileText, 
          path: '/billing',
          description: 'Subscription & usage'
        },
        { 
          name: 'Security', 
          icon: Shield, 
          path: '/security',
          description: 'API keys & access'
        },
        { 
          name: 'Settings', 
          icon: Settings, 
          path: '/settings',
          description: 'Organization config'
        }
      ]
    }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const canAccess = (item) => {
    if (item.creatorOnly && !user?.is_creator) return false
    if (item.premium && organization?.subscription_tier === 'free') return false
    return true
  }

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-900 border-r border-slate-700 transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationItems.map((section) => (
            <div key={section.section}>
              {isOpen && (
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {section.section}
                </h3>
              )}
              
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  const accessible = canAccess(item)
                  
                  return (
                    <div key={item.name} className="relative group">
                      <Button
                        variant="ghost"
                        onClick={() => accessible && navigate(item.path)}
                        disabled={!accessible}
                        className={`w-full justify-start h-auto p-3 ${
                          active 
                            ? 'bg-purple-600 text-white hover:bg-purple-700' 
                            : accessible
                              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              : 'text-slate-500 cursor-not-allowed'
                        } ${!isOpen ? 'px-3' : ''}`}
                      >
                        <Icon className={`h-5 w-5 ${isOpen ? 'mr-3' : ''} flex-shrink-0`} />
                        
                        {isOpen && (
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.name}</span>
                              <div className="flex items-center space-x-1">
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                                {item.premium && (
                                  <Crown className="h-3 w-3 text-yellow-400" />
                                )}
                                {item.creatorOnly && !user?.is_creator && (
                                  <Badge variant="outline" className="text-xs border-purple-400 text-purple-400">
                                    Creator
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        )}
                      </Button>
                      
                      {/* Tooltip for collapsed sidebar */}
                      {!isOpen && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                          {item.name}
                          {!accessible && (
                            <span className="text-purple-400 ml-1">
                              {item.creatorOnly ? '(Creator)' : '(Premium)'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-slate-700">
          {isOpen ? (
            <div className="space-y-3">
              {/* Subscription status */}
              <div className="p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">
                    {organization?.subscription_tier?.replace('_', ' ').toUpperCase() || 'FREE'}
                  </span>
                  {organization?.subscription_tier === 'free' && (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs">
                      Upgrade
                    </Button>
                  )}
                </div>
                
                {organization && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Tokens</span>
                      <span className="text-white">
                        {organization.token_balance?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1">
                      <div 
                        className="bg-purple-500 h-1 rounded-full" 
                        style={{ 
                          width: `${Math.min((organization.token_balance / organization.monthly_token_limit) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/marketplace')}
                  className="flex-1 border-slate-600 text-slate-200 text-xs"
                >
                  <Store className="h-3 w-3 mr-1" />
                  Browse
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/creator')}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
                >
                  <Palette className="h-3 w-3 mr-1" />
                  Create
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/marketplace')}
                className="w-full p-2 text-slate-400 hover:text-white"
              >
                <Store className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/creator')}
                className="w-full p-2 text-slate-400 hover:text-white"
              >
                <Palette className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

