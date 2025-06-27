import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const HARMONY_AGENTS = [
  {
    id: 'cashflow',
    name: 'Cashflow',
    title: 'The Closer',
    lore: 'Your 24/7 sales champion that never misses a lead.',
    description: 'Finds, nurtures & books calls with prospects via email, SMS, LinkedIn DMs.',
    functionality: 'Sends sequenced messages, handles objections, logs everything in your CRM, then nudges your reps when a lead is hot.',
    integrations: ['HubSpot', 'Salesforce', 'Gmail', 'Twilio', 'LinkedIn API', 'Calendly'],
    pricing: {
      core: { monthly: 444, yearly: 4440, promo: 310.80 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Books hundreds of meetings without hiring extra SDRs. Pays for itself in one closed deal.',
    tiers: ['Starter (Core only)', 'Growth (+voice & ROI)', 'Scale (+custom playbooks)'],
    avatar: '/agents/cashflow-avatar.png',
    color: '#D4AF37'
  },
  {
    id: 'grace',
    name: 'Grace',
    title: 'The Concierge',
    lore: 'Your digital front-desk, always warm and helpful.',
    description: 'Answers live chat, sends FAQs, walks new clients through your onboarding.',
    functionality: 'Reads visitor messages, matches to knowledge base, fires workflows (emails, Slack notifications).',
    integrations: ['Intercom', 'Zendesk', 'Slack', 'Gmail', 'GoHighLevel'],
    pricing: {
      core: { monthly: 444, yearly: 4440, promo: 310.80 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Cuts support headcount by half while boosting customer satisfaction.',
    tiers: ['Lite (chat only)', 'Pro (+voice)', 'Enterprise (+24/7 multilingual support)'],
    avatar: '/agents/grace-avatar.png',
    color: '#4A90E2'
  },
  {
    id: 'aster',
    name: 'Aster',
    title: 'The Talent Finder',
    lore: 'Your growth gardener, sprouting top talent.',
    description: 'Screens resumes, schedules interviews, runs new-hire onboarding flows.',
    functionality: 'Parses applications, sends forms, books calls, guides hires through compliance checklists.',
    integrations: ['LinkedIn Recruiter API', 'Greenhouse', 'Typeform', 'Calendly', 'Notion'],
    pricing: {
      core: { monthly: 444, yearly: 4440, promo: 310.80 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Cuts hiring time by 60% and ensures paperwork compliance.',
    tiers: ['Basic (resume parsing)', 'Plus (+onboarding flows)', 'Elite (+assessments & training)'],
    avatar: '/agents/aster-avatar.png',
    color: '#7B68EE'
  },
  {
    id: 'iris',
    name: 'Iris',
    title: 'The Spotlight',
    lore: 'Your digital brand ambassador, shining a light on your story.',
    description: 'Plans, writes & schedules social posts; answers comments; reports engagement.',
    functionality: 'Scans trends, drafts content, auto-posts to Instagram, LinkedIn, TikTok; analyzes results.',
    integrations: ['Meta API', 'TikTok API', 'Buffer', 'Canva', 'Google Analytics'],
    pricing: {
      core: { monthly: 350, yearly: 3500, promo: 245 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Grows followers and engagement without a full-time social team.',
    tiers: ['Social Lite', 'Social Pro (+video)', 'Social Max (+influencer outreach)'],
    avatar: '/agents/iris-avatar.png',
    color: '#FF6B6B'
  },
  {
    id: 'helios',
    name: 'Helios',
    title: 'The Scheduler',
    lore: 'Your time guardian, defending your calendar.',
    description: 'Syncs calendars, books meetings, sends reminders & daily agendas.',
    functionality: 'Reads availability, proposes slots, auto-confirms, triages conflict.',
    integrations: ['Google Calendar', 'Outlook', 'Zoom', 'Slack', 'Notion'],
    pricing: {
      core: { monthly: 444, yearly: 4440, promo: 310.80 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Restores hours of focus by eliminating back-and-forth scheduling.',
    tiers: ['Basic Scheduler', 'Pro (+email triage)', 'Ultimate (+voice assistant)'],
    avatar: '/agents/helios-avatar.png',
    color: '#FFA500'
  },
  {
    id: 'atlas',
    name: 'Atlas',
    title: 'The Flow Master',
    lore: 'The project architect who holds all the pieces in balance.',
    description: 'Creates & assigns tasks, tracks deadlines, alerts on delays.',
    functionality: 'Reads your ClickUp/Trello boards, updates statuses, sends team nudges.',
    integrations: ['ClickUp', 'Asana', 'Trello', 'Slack', 'Jira'],
    pricing: {
      core: { monthly: 444, yearly: 4440, promo: 310.80 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Boosts team throughput by 30–50% through automated follow-ups.',
    tiers: ['Task Lite', 'Task Pro (+reports)', 'Task Enterprise (+resource forecasting)'],
    avatar: '/agents/atlas-avatar.png',
    color: '#32CD32'
  },
  {
    id: 'calliope',
    name: 'Calliope',
    title: 'The Wordsmith',
    lore: 'The storyteller who weaves your brand\'s epic.',
    description: 'Writes blogs, emails, landing pages, and SEO copy.',
    functionality: 'Takes prompts, researches keywords, drafts & edits content, then publishes.',
    integrations: ['WordPress', 'Ghost', 'Google Docs', 'Mailchimp', 'SEMrush'],
    pricing: {
      core: { monthly: 444, yearly: 4440, promo: 310.80 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Fills your content pipeline instantly—traffic & leads soar.',
    tiers: ['Content Lite', 'Content Pro (+multilingual)', 'Content Max (+video scripts)'],
    avatar: '/agents/calliope-avatar.png',
    color: '#9370DB'
  },
  {
    id: 'zephyr',
    name: 'Zephyr',
    title: 'The Email Whisperer',
    lore: 'The breeze that carries your message straight to the inbox.',
    description: 'Crafts & automates email sequences, A/B tests subject lines, and tracks opens/clicks.',
    functionality: 'Segments lists, builds drip flows, syncs with purchase data for smart triggers.',
    integrations: ['Mailchimp', 'ActiveCampaign', 'Stripe', 'GoHighLevel'],
    pricing: {
      core: { monthly: 350, yearly: 3500, promo: 245 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'One campaign can pay for the agent ten times over.',
    tiers: ['Email Lite', 'Email Pro (+SMS)', 'Email Ultimate (+predictive sends)'],
    avatar: '/agents/zephyr-avatar.png',
    color: '#20B2AA'
  },
  {
    id: 'aurum',
    name: 'Aurum',
    title: 'The Finance Guardian',
    lore: 'The dragon protecting your treasure chest.',
    description: 'Tracks revenue, expenses, cash flow, and flags anomalies or leaks.',
    functionality: 'Reads Stripe, QuickBooks, bank feeds; categorizes transactions; sends alerts.',
    integrations: ['Stripe', 'QuickBooks', 'Xero', 'Plaid'],
    pricing: {
      core: { monthly: 500, yearly: 5000, promo: 350 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Prevents costly mistakes and maximizes cash runway.',
    tiers: ['Finance Lite', 'Finance Pro (+forecasting)', 'Finance Enterprise (+audit)'],
    avatar: '/agents/aurum-avatar.png',
    color: '#FFD700'
  },
  {
    id: 'athena',
    name: 'Athena',
    title: 'The Legal Mind',
    lore: 'The wise guardian of your contracts and compliance.',
    description: 'Scans agreements, checks for missing clauses, tracks policy deadlines.',
    functionality: 'Reviews contracts, flags risks, maintains compliance calendars, generates reports.',
    integrations: ['DocuSign', 'PandaDoc', 'Google Drive', 'Slack', 'Notion'],
    pricing: {
      core: { monthly: 500, yearly: 5000, promo: 350 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Prevents legal issues and ensures regulatory compliance.',
    tiers: ['Legal Lite', 'Legal Pro (+compliance)', 'Legal Enterprise (+risk analysis)'],
    avatar: '/agents/athena-avatar.png',
    color: '#B8860B'
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    title: 'The Data Alchemist',
    lore: 'Rising from data chaos to deliver golden insights.',
    description: 'Analyzes data, creates reports, and provides actionable business intelligence.',
    functionality: 'Connects to databases, generates visualizations, sends automated reports.',
    integrations: ['Google Analytics', 'Tableau', 'Power BI', 'SQL databases', 'Excel'],
    pricing: {
      core: { monthly: 500, yearly: 5000, promo: 350 },
      plugin: { monthly: 19, yearly: 199, promo: 150 }
    },
    roi: 'Transforms raw data into strategic decisions and revenue growth.',
    tiers: ['Analytics Lite', 'Analytics Pro (+predictions)', 'Analytics Enterprise (+AI insights)'],
    avatar: '/agents/phoenix-avatar.png',
    color: '#DC143C'
  },
  {
    id: 'sol',
    name: 'Sōl',
    title: 'The Orchestrator',
    lore: 'The central sun that coordinates all other agents.',
    description: 'Routes tasks among agents, aggregates results, and maintains context.',
    functionality: 'Central brain that delegates to other agents and combines their outputs.',
    integrations: ['All Harmony Agents', 'Zapier', 'API Gateway', 'Vector Database'],
    pricing: {
      core: { monthly: 1000, yearly: 10000, promo: 700 },
      plugin: { monthly: 50, yearly: 500, promo: 350 }
    },
    roi: 'Multiplies the value of all other agents through intelligent coordination.',
    tiers: ['Orchestrator Basic', 'Orchestrator Pro (+memory)', 'Orchestrator Enterprise (+custom flows)'],
    avatar: '/agents/sol-avatar.png',
    color: '#FF4500'
  }
]

export default function CompleteAgentMarketplace() {
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [filter, setFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  const filteredAgents = HARMONY_AGENTS.filter(agent => {
    if (filter !== 'all' && !agent.name.toLowerCase().includes(filter.toLowerCase())) return false
    if (priceRange === 'budget' && agent.pricing.core.monthly > 400) return false
    if (priceRange === 'premium' && agent.pricing.core.monthly < 400) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white mb-2">Harmony Agent Marketplace</h1>
          <p className="text-slate-300">Discover and deploy AI agents that transform your business</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 mb-8">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-600"
          >
            <option value="all">All Categories</option>
            <option value="sales">Sales & Marketing</option>
            <option value="support">Support & Service</option>
            <option value="operations">Operations</option>
            <option value="finance">Finance & Legal</option>
          </select>
          
          <select 
            value={priceRange} 
            onChange={(e) => setPriceRange(e.target.value)}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-600"
          >
            <option value="all">All Prices</option>
            <option value="budget">Budget ($350-$400)</option>
            <option value="premium">Premium ($400+)</option>
          </select>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden cursor-pointer"
              onClick={() => setSelectedAgent(agent)}
            >
              {/* Agent Avatar */}
              <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.name.charAt(0)}
                </div>
              </div>

              {/* Agent Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                <p className="text-amber-400 text-sm mb-3">{agent.title}</p>
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">{agent.lore}</p>
                
                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-white">${agent.pricing.core.promo}</span>
                    <span className="text-slate-400 text-sm ml-1">/mo</span>
                  </div>
                  <span className="text-xs text-slate-400 line-through">${agent.pricing.core.monthly}</span>
                </div>

                {/* Integration Count */}
                <div className="flex items-center text-slate-400 text-sm mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {agent.integrations.length} integrations
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all">
                  Deploy Agent
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                    style={{ backgroundColor: selectedAgent.color }}
                  >
                    {selectedAgent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedAgent.name}</h2>
                    <p className="text-amber-400">{selectedAgent.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">About</h3>
                  <p className="text-slate-300 mb-6">{selectedAgent.lore}</p>
                  
                  <h3 className="text-lg font-bold text-white mb-3">What it does</h3>
                  <p className="text-slate-300 mb-6">{selectedAgent.description}</p>
                  
                  <h3 className="text-lg font-bold text-white mb-3">How it works</h3>
                  <p className="text-slate-300 mb-6">{selectedAgent.functionality}</p>
                  
                  <h3 className="text-lg font-bold text-white mb-3">ROI Impact</h3>
                  <p className="text-green-400 mb-6">{selectedAgent.roi}</p>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Pricing Tiers</h3>
                  <div className="space-y-3 mb-6">
                    {selectedAgent.tiers.map((tier, index) => (
                      <div key={index} className="bg-slate-700/50 p-3 rounded-lg">
                        <span className="text-slate-300">{tier}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3">Integrations</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedAgent.integrations.map((integration, index) => (
                      <span 
                        key={index}
                        className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm"
                      >
                        {integration}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3">Pricing</h3>
                  <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">Core Package</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">${selectedAgent.pricing.core.promo}</span>
                        <span className="text-slate-400 text-sm ml-1">/mo</span>
                        <div className="text-xs text-slate-400 line-through">${selectedAgent.pricing.core.monthly}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Plugin Add-on</span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-white">+${selectedAgent.pricing.plugin.promo}</span>
                        <span className="text-slate-400 text-sm ml-1">/mo</span>
                        <div className="text-xs text-slate-400 line-through">+${selectedAgent.pricing.plugin.monthly}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all">
                      Deploy Core Package
                    </button>
                    <button className="w-full bg-slate-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-600 transition-all">
                      Try Demo First
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

