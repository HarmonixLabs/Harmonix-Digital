import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  Search, 
  Filter, 
  Star, 
  Zap, 
  Lock, 
  Play, 
  ShoppingCart,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Crown
} from 'lucide-react'

const Marketplace = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [agents, setAgents] = useState([])
  const [filteredAgents, setFilteredAgents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  // Harmony AI Agents from the roster
  const harmonyAgents = [
    {
      id: 'cash',
      name: 'CASH',
      role: 'AI Sales Closer',
      description: 'Lead scoring, qualification, and booking automation with CRM integration',
      core_powers: ['Lead scoring and qualification (BANT, ICP)', 'Booking and follow-up automation', 'Integrated with GoHighLevel, Slack, Calendly'],
      superpowers: ['Auto-sends calendar invites + reminders', 'Connects to CRM and updates deal stages', 'Records convos, outputs follow-up scripts'],
      demo_trigger: 'I need to book more calls',
      nft_badge: 'Closer Circuitry',
      category: 'sales',
      is_demo_available: true,
      is_harmony_core: true,
      base_price: 149,
      pricing_tiers: [
        { name: 'Starter', price: 149, features: ['Basic lead scoring', 'CRM integration', '500 interactions/month'] },
        { name: 'Professional', price: 299, features: ['Advanced qualification', 'Multi-CRM sync', '2000 interactions/month'] },
        { name: 'Enterprise', price: 599, features: ['Custom workflows', 'White-label', 'Unlimited interactions'] }
      ],
      total_deployments: 1247,
      average_rating: 4.8,
      total_ratings: 156,
      webhook_url: 'https://eo23u9ufn73cdhy.m.pipedream.net'
    },
    {
      id: 'echo',
      name: 'ECHO',
      role: 'Social + Story Content AI',
      description: 'Generates branded captions, videos, reels with calendar sync for approval',
      core_powers: ['Generates branded captions, videos, reels', 'Syncs w/ calendar & Slack for approval'],
      superpowers: ['Uses VEO3, ChatGPT-4, Manus for top-tier creative', 'Learns brand tone from prompts + input'],
      demo_trigger: 'Create a reel + caption for my launch',
      nft_badge: 'The Storycaster',
      category: 'content',
      is_demo_available: true,
      is_harmony_core: true,
      base_price: 199,
      pricing_tiers: [
        { name: 'Creator', price: 199, features: ['Content generation', 'Brand voice learning', '100 posts/month'] },
        { name: 'Agency', price: 399, features: ['Multi-brand management', 'Team collaboration', '500 posts/month'] },
        { name: 'Enterprise', price: 799, features: ['Custom models', 'API access', 'Unlimited posts'] }
      ],
      total_deployments: 892,
      average_rating: 4.9,
      total_ratings: 203,
      webhook_url: 'https://eonvbjxovddzlaj.m.pipedream.net'
    },
    {
      id: 'flow',
      name: 'FLOW',
      role: 'Process Optimizer & SOP Builder',
      description: 'Analyzes workflows and builds SOP templates in real-time',
      core_powers: ['Analyzes current workflows', 'Recommends streamlined automations', 'Builds SOP templates in real-time'],
      superpowers: ['ClickUp & Notion integrations', 'Tracks task load by department'],
      demo_trigger: 'Help me organize my process',
      nft_badge: 'The Architect Node',
      category: 'automation',
      is_demo_available: true,
      is_harmony_core: true,
      base_price: 249,
      pricing_tiers: [
        { name: 'Startup', price: 249, features: ['Process analysis', 'Basic SOPs', '50 workflows/month'] },
        { name: 'Business', price: 499, features: ['Advanced optimization', 'Team templates', '200 workflows/month'] },
        { name: 'Enterprise', price: 999, features: ['Custom integrations', 'Consulting', 'Unlimited workflows'] }
      ],
      total_deployments: 634,
      average_rating: 4.7,
      total_ratings: 89,
      webhook_url: 'https://eoebhnlvmpgfa4i.m.pipedream.net'
    },
    {
      id: 'grace',
      name: 'GRACE',
      role: 'Customer Support AI',
      description: 'Intelligent customer support and relationship management',
      core_powers: ['24/7 customer support', 'Ticket management', 'Relationship building'],
      superpowers: ['Multi-channel support', 'Sentiment analysis', 'Proactive outreach'],
      demo_trigger: 'Help me improve customer satisfaction',
      nft_badge: 'White Glove Synth',
      category: 'support',
      is_demo_available: true,
      is_harmony_core: true,
      base_price: 179,
      pricing_tiers: [
        { name: 'Essential', price: 179, features: ['Basic support', 'Email integration', '1000 tickets/month'] },
        { name: 'Professional', price: 349, features: ['Multi-channel', 'Analytics', '5000 tickets/month'] },
        { name: 'Enterprise', price: 699, features: ['Custom workflows', 'API access', 'Unlimited tickets'] }
      ],
      total_deployments: 1089,
      average_rating: 4.6,
      total_ratings: 167,
      webhook_url: 'https://eolfvvzcboweq72.m.pipedream.net'
    },
    {
      id: 'kairos',
      name: 'KAIROS',
      role: 'Time Architect & Calendar AI',
      description: 'Builds launch timelines and tracks execution with team coordination',
      core_powers: ['Builds launch timelines, tracks execution', 'Calendar auto-population for teams'],
      superpowers: ['GCal, ClickUp, HubSpot sync', 'Warns when projects are off track'],
      demo_trigger: 'Help me schedule my launch roadmap',
      nft_badge: 'Clockwork Conductor',
      category: 'productivity',
      is_demo_available: true,
      is_harmony_core: true,
      base_price: 129,
      pricing_tiers: [
        { name: 'Solo', price: 129, features: ['Personal scheduling', 'Basic timelines', '10 projects/month'] },
        { name: 'Team', price: 259, features: ['Team coordination', 'Advanced tracking', '50 projects/month'] },
        { name: 'Enterprise', price: 519, features: ['Multi-team sync', 'Custom integrations', 'Unlimited projects'] }
      ],
      total_deployments: 756,
      average_rating: 4.5,
      total_ratings: 134,
      webhook_url: 'https://eotv63jouum0j3m.m.pipedream.net'
    },
    {
      id: 'sol',
      name: 'SŌL',
      role: 'HarmonyBrain Orchestrator',
      description: 'Orchestrates all agents and routes tasks to the most suitable agent',
      core_powers: ['Routes tasks to relevant agents', 'Learns org structure, remembers users'],
      superpowers: ['Suggests best agent per use case', 'Approves or requests clarification from users'],
      demo_trigger: "What's my top priority today?",
      nft_badge: 'Crown Core (Uncopyable)',
      category: 'orchestration',
      is_demo_available: false,
      is_harmony_core: true,
      base_price: 499,
      pricing_tiers: [
        { name: 'Professional', price: 499, features: ['Basic orchestration', '5 agents max', 'Standard routing'] },
        { name: 'Enterprise', price: 999, features: ['Advanced AI routing', '15 agents max', 'Custom workflows'] },
        { name: 'White Label', price: 1999, features: ['Full customization', 'Unlimited agents', 'Your branding'] }
      ],
      total_deployments: 234,
      average_rating: 5.0,
      total_ratings: 45,
      webhook_url: 'https://eoww91ocph942ds.m.pipedream.net'
    }
  ]

  useEffect(() => {
    setAgents(harmonyAgents)
    setFilteredAgents(harmonyAgents)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = agents

    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(agent => agent.category === selectedCategory)
    }

    setFilteredAgents(filtered)
  }, [searchTerm, selectedCategory, agents])

  const categories = [
    { id: 'all', name: 'All Agents', count: agents.length },
    { id: 'sales', name: 'Sales & CRM', count: agents.filter(a => a.category === 'sales').length },
    { id: 'content', name: 'Content & Marketing', count: agents.filter(a => a.category === 'content').length },
    { id: 'automation', name: 'Automation', count: agents.filter(a => a.category === 'automation').length },
    { id: 'support', name: 'Customer Support', count: agents.filter(a => a.category === 'support').length },
    { id: 'productivity', name: 'Productivity', count: agents.filter(a => a.category === 'productivity').length },
    { id: 'orchestration', name: 'Orchestration', count: agents.filter(a => a.category === 'orchestration').length }
  ]

  const handleAgentClick = (agent) => {
    navigate(`/agent/${agent.id}`)
  }

  const handleDemoClick = (agent, e) => {
    e.stopPropagation()
    if (!agent.is_demo_available) {
      if (!user) {
        navigate('/login')
      } else {
        // Show upgrade modal
        alert('This agent requires a subscription to demo. Please upgrade your plan.')
      }
      return
    }
    
    // Open demo modal or navigate to demo page
    navigate(`/agent/${agent.id}?demo=true`)
  }

  const handleDeployClick = (agent, e) => {
    e.stopPropagation()
    if (!user) {
      navigate('/login')
    } else {
      // Navigate to deployment flow
      navigate(`/agent/${agent.id}?deploy=true`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Harmony AI Marketplace
        </h1>
        <p className="text-xl text-purple-200 max-w-2xl mx-auto">
          Discover and deploy specialized AI agents to transform your business operations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search agents by name, role, or capability..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-slate-600 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card 
            key={agent.id} 
            className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-all cursor-pointer group"
            onClick={() => handleAgentClick(agent)}
          >
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                  {agent.is_harmony_core && (
                    <Crown className="h-5 w-5 text-yellow-400" />
                  )}
                </div>
                <Badge className="bg-purple-600 text-white">
                  {agent.category}
                </Badge>
              </div>
              <CardTitle className="text-purple-200 text-sm font-medium">
                {agent.role}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {agent.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center text-slate-400">
                  <Users className="h-4 w-4 mr-1" />
                  {agent.total_deployments.toLocaleString()}
                </div>
                <div className="flex items-center text-slate-400">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  {agent.average_rating} ({agent.total_ratings})
                </div>
                <div className="flex items-center text-slate-400">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${agent.base_price}/mo
                </div>
              </div>

              {/* Core Powers Preview */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Core Powers:</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  {agent.core_powers.slice(0, 2).map((power, index) => (
                    <li key={index} className="flex items-start">
                      <Zap className="h-3 w-3 mr-1 mt-0.5 text-yellow-400 flex-shrink-0" />
                      {power}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleDemoClick(agent, e)}
                  disabled={!agent.is_demo_available && !user}
                  className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  {agent.is_demo_available ? (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Demo
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-1" />
                      {user ? 'Premium' : 'Login to Demo'}
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  onClick={(e) => handleDeployClick(agent, e)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {user ? 'Deploy' : 'Sign Up'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No agents found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Call to Action */}
      {!user && (
        <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses already using Harmony AI agents to automate workflows, 
              boost productivity, and drive growth.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="bg-white text-purple-900 hover:bg-gray-100"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-white text-white hover:bg-white hover:text-purple-900"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Marketplace

