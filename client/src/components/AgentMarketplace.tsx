import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Crown, Lock, ShoppingCart } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  performance: string;
  royalties: string;
  locked?: boolean;
  tier: 'Executive' | 'HR' | 'SOP' | 'Sales' | 'Concierge' | 'Content';
  description: string;
  price: number;
}

const agents: Agent[] = [
  {
    id: 'executive',
    name: 'Executive Assistant',
    type: 'Executive Support',
    performance: '+62%',
    royalties: '8%',
    tier: 'Executive',
    description: 'Strategic task management and executive coordination',
    price: 299
  },
  {
    id: 'hr',
    name: 'HR Agent',
    type: 'Human Resources',
    performance: '+55%',
    royalties: '10%',
    tier: 'HR',
    description: 'Employee management and recruitment automation',
    price: 249
  },
  {
    id: 'sop',
    name: 'SOP Agent',
    type: 'Process Management',
    performance: '+71%',
    royalties: '7%',
    tier: 'SOP',
    locked: true,
    description: 'Standard operating procedures and workflow optimization',
    price: 399
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    type: 'Revenue Generation',
    performance: '+59%',
    royalties: '5%',
    tier: 'Sales',
    description: 'Lead qualification and sales automation',
    price: 349
  }
];

const AgentMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Performance');
  const [selectedRoyalty, setSelectedRoyalty] = useState('10% or Less Royalties');

  const categories = ['All Performance', 'HR & Recruiting', 'Sales & Revenue', 'Operations', 'Executive'];
  const royaltyFilters = ['10% or Less Royalties', '5% or Less Royalties', 'Premium Agents'];

  return (
    <div className="min-h-screen bg-deep-navy">
      {/* Header */}
      <div className="border-b border-golden-primary/20 bg-deep-navy/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <g fill="#D4AF37">
                    <path d="M8 6 L12 10 L8 14 L4 10 Z" opacity="0.9" />
                    <path d="M16 6 L20 10 L16 14 L12 10 Z" opacity="0.8" />
                    <path d="M24 6 L28 10 L24 14 L20 10 Z" opacity="0.7" />
                    <path d="M12 14 L16 18 L12 22 L8 18 Z" opacity="0.8" />
                    <path d="M20 14 L24 18 L20 22 L16 18 Z" opacity="0.9" />
                    <path d="M16 22 L20 26 L16 30 L12 26 Z" opacity="0.8" />
                  </g>
                </svg>
              </div>
              <span className="text-xl font-semibold text-golden-primary tracking-wide">
                HARMONIX
              </span>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/dashboard" className="text-warm-white hover:text-golden-primary transition-colors">
                Dashboard
              </a>
              <a href="/marketplace" className="text-golden-primary font-medium">
                Marketplace
              </a>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-golden-primary/10 transition-colors">
                <Search className="w-5 h-5 text-golden-primary" />
              </button>
              <div className="w-8 h-8 rounded-full bg-golden-primary/20 border border-golden-primary/30 flex items-center justify-center">
                <span className="text-xs text-golden-primary font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-playfair text-golden-primary mb-4">
            Agent Marketplace
          </h1>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-golden-primary/60" />
            <input
              type="text"
              placeholder="Search agents"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-charcoal-deep/50 border border-golden-primary/20 rounded-lg text-warm-white placeholder-golden-primary/60 focus:border-golden-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-charcoal-deep/50 border border-golden-primary/20 rounded-lg text-warm-white focus:border-golden-primary focus:outline-none transition-colors"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-charcoal-deep">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Royalty Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedRoyalty}
              onChange={(e) => setSelectedRoyalty(e.target.value)}
              className="px-4 py-3 bg-charcoal-deep/50 border border-golden-primary/20 rounded-lg text-warm-white focus:border-golden-primary focus:outline-none transition-colors"
            >
              {royaltyFilters.map((filter) => (
                <option key={filter} value={filter} className="bg-charcoal-deep">
                  {filter}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Filter */}
          <div className="text-warm-white/70">
            AllCompliance
          </div>
        </motion.div>

        {/* Agent Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div className="relative bg-gradient-to-b from-charcoal-deep/80 to-deep-navy border border-golden-primary/20 rounded-xl p-6 h-full overflow-hidden group-hover:border-golden-primary/40 transition-all duration-300">
                
                {/* Performance Badge */}
                <div className="absolute top-4 right-4 flex flex-col items-end space-y-1">
                  <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                    {agent.performance}
                  </div>
                  <div className="px-2 py-1 bg-golden-primary/20 text-golden-primary text-xs font-semibold rounded">
                    {agent.royalties}
                  </div>
                </div>

                {/* Agent Avatar */}
                <div className="relative mb-6">
                  <div className="w-24 h-32 mx-auto relative">
                    {/* Silhouette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-jade-forest to-jade-forest-muted rounded-lg flex items-center justify-center">
                      <div className="relative w-16 h-20">
                        {/* Head */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-10 bg-jade-forest-muted rounded-full" />
                        
                        {/* Eyes */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          <div className="w-1 h-1 bg-golden-primary rounded-full animate-pulse" />
                          <div className="w-1 h-1 bg-golden-primary rounded-full animate-pulse" />
                        </div>
                        
                        {/* Lotus Crown */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                          <svg viewBox="0 0 16 8" className="w-4 h-2">
                            <g fill="#D4AF37">
                              <path d="M8 0 L10 2 L8 4 L6 2 Z" opacity="0.9" />
                              <path d="M12 1 L14 3 L12 5 L10 3 Z" opacity="0.8" />
                              <path d="M4 1 L6 3 L4 5 L2 3 Z" opacity="0.8" />
                            </g>
                          </svg>
                        </div>
                        
                        {/* Body */}
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-12 bg-jade-forest-muted rounded-sm" />
                        
                        {/* Chest Lotus */}
                        {!agent.locked && (
                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                            <svg viewBox="0 0 12 6" className="w-3 h-1.5">
                              <g fill="#D4AF37">
                                <path d="M6 0 L7 1 L6 2 L5 1 Z" opacity="0.9" />
                                <path d="M8 0.5 L9 1.5 L8 2.5 L7 1.5 Z" opacity="0.8" />
                                <path d="M4 0.5 L5 1.5 L4 2.5 L3 1.5 Z" opacity="0.8" />
                              </g>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lock Overlay */}
                    {agent.locked && (
                      <div className="absolute inset-0 bg-charcoal-deep/80 rounded-lg flex items-center justify-center">
                        <Lock className="w-6 h-6 text-golden-primary/60" />
                      </div>
                    )}
                  </div>

                  {/* Tier Badge */}
                  {agent.locked && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-charcoal-deep border border-golden-primary/30 rounded text-xs text-golden-primary/70">
                      SOP | 01-GENT
                    </div>
                  )}
                </div>

                {/* Agent Info */}
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-warm-white group-hover:text-golden-primary transition-colors">
                    {agent.name}
                  </h3>
                  
                  {agent.locked && (
                    <div className="text-sm text-warm-white/60">
                      (Locked)
                    </div>
                  )}

                  <p className="text-sm text-warm-white/70 leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  {agent.locked ? (
                    <button
                      disabled
                      className="w-full py-3 bg-charcoal-deep/50 border border-golden-primary/20 rounded-lg text-golden-primary/50 font-medium cursor-not-allowed"
                    >
                      Locked
                    </button>
                  ) : (
                    <motion.button
                      className="w-full py-3 bg-golden-primary/20 hover:bg-golden-primary/30 border border-golden-primary/30 hover:border-golden-primary rounded-lg text-golden-primary font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Purchase</span>
                    </motion.button>
                  )}
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-golden-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button className="px-8 py-3 border border-golden-primary/30 hover:bg-golden-primary/10 rounded-lg text-golden-primary font-medium transition-all duration-300">
            Load More Agents
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentMarketplace;