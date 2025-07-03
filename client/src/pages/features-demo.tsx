import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AnimatedFormField, 
  AnimatedSubmitButton, 
  validationRules 
} from '@/components/ui/animated-form-validation';
import { 
  AILoadingSkeleton, 
  AIContentSkeleton, 
  AICardSkeleton 
} from '@/components/ui/ai-loading-skeleton';
import {
  AgentPerformanceWidget,
  TaskCompletionWidget,
  EnergyMeterWidget,
  AchievementWidget,
  QuickStatsWidget
} from '@/components/ui/personalized-widgets';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { AITooltip, AIHelpButton, useSmartTooltip } from '@/components/ui/ai-tooltip-system';
import { 
  Sparkles, 
  Wand2, 
  Palette, 
  MessageSquare, 
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  CheckCircle
} from 'lucide-react';

export default function FeaturesDemo() {
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);

  const { getContextualContent } = useSmartTooltip();

  const handleFormSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const toggleSkeletons = () => {
    setShowSkeletons(!showSkeletons);
    if (!showSkeletons) {
      setTimeout(() => setShowSkeletons(false), 5000);
    }
  };

  const demoSections = [
    {
      id: 'form-validation',
      title: 'Animated Form Validation',
      icon: <Wand2 className="w-5 h-5" />,
      description: 'Real-time validation with smooth micro-interactions'
    },
    {
      id: 'ai-loading',
      title: 'AI Character Loading',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Playful loading states with AI personality mascots'
    },
    {
      id: 'dashboard-widgets',
      title: 'Dashboard Widgets',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Personalized widgets with cute progress animations'
    },
    {
      id: 'theme-switcher',
      title: 'Theme Switcher',
      icon: <Palette className="w-5 h-5" />,
      description: 'One-click theme switching with smooth transitions'
    },
    {
      id: 'ai-tooltips',
      title: 'AI Guide System',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Contextual tooltips with friendly AI guide bubbles'
    }
  ];

  return (
    <div className="min-h-screen bg-harmonix-black text-harmonix-sage">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-harmonix-sage/20 bg-harmonix-night/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-jade-forest mb-1">
                Interactive Features Demo
              </h1>
              <p className="text-harmonix-sage/70">
                Explore all the animated micro-interactions and AI-powered components
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <AIHelpButton personality="harmonix" />
              <ThemeSwitcher variant="compact" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Demo Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {demoSections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentDemo(currentDemo === section.id ? null : section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                  currentDemo === section.id
                    ? 'bg-jade-forest/20 border-jade-forest text-jade-forest'
                    : 'bg-harmonix-night border-harmonix-sage/20 hover:border-jade-forest/40'
                }`}
              >
                {section.icon}
                <span className="font-medium">{section.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Demo Content */}
        <AnimatePresence mode="wait">
          {currentDemo === 'form-validation' && (
            <motion.div
              key="form-validation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="bg-harmonix-night border-harmonix-sage/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-jade-forest">
                    <Wand2 className="w-5 h-5" />
                    Animated Form Validation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <AnimatedFormField
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                        validation={validationRules.email}
                        required
                      />
                      
                      <AnimatedFormField
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                        validation={validationRules.password}
                        required
                      />
                      
                      <AnimatedFormField
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                        validation={validationRules.required}
                        required
                      />
                      
                      <AnimatedSubmitButton
                        isLoading={isLoading}
                        success={isSuccess}
                        onClick={handleFormSubmit}
                      >
                        Create Account
                      </AnimatedSubmitButton>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-harmonix-sage">Features:</h3>
                      <ul className="space-y-2 text-sm text-harmonix-sage/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Real-time validation with visual feedback
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Smooth scale and glow animations on focus
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Contextual success/error messages
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Animated submit button with loading states
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentDemo === 'ai-loading' && (
            <motion.div
              key="ai-loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="bg-harmonix-night border-harmonix-sage/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-jade-forest">
                    <Sparkles className="w-5 h-5" />
                    AI Character Loading Skeletons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <AILoadingSkeleton 
                      variant="harmonix" 
                      message="Harmony is processing..."
                      progress={75}
                    />
                    <AILoadingSkeleton 
                      variant="sol" 
                      message="SŌL is thinking deeply..."
                      progress={45}
                    />
                    <AILoadingSkeleton 
                      variant="cash" 
                      message="CA$H is calculating..."
                      progress={90}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={toggleSkeletons}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {showSkeletons ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {showSkeletons ? 'Hide' : 'Show'} Content Skeletons
                      </Button>
                    </div>
                    
                    {showSkeletons && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid md:grid-cols-2 gap-4"
                      >
                        <AICardSkeleton variant="grace" />
                        <AIContentSkeleton variant="atlas" lines={4} />
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentDemo === 'dashboard-widgets' && (
            <motion.div
              key="dashboard-widgets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AgentPerformanceWidget />
                <TaskCompletionWidget />
                <EnergyMeterWidget />
                <AchievementWidget />
                <QuickStatsWidget />
              </div>
            </motion.div>
          )}

          {currentDemo === 'theme-switcher' && (
            <motion.div
              key="theme-switcher"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="bg-harmonix-night border-harmonix-sage/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-jade-forest">
                    <Palette className="w-5 h-5" />
                    Theme Switcher Variants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-harmonix-sage">Compact</h3>
                      <ThemeSwitcher variant="compact" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-harmonix-sage">Expanded</h3>
                      <ThemeSwitcher variant="expanded" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-harmonix-sage">Floating</h3>
                      <div className="relative h-32 bg-harmonix-sage/5 rounded-lg">
                        <ThemeSwitcher variant="floating" className="relative top-4 right-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentDemo === 'ai-tooltips' && (
            <motion.div
              key="ai-tooltips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="bg-harmonix-night border-harmonix-sage/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-jade-forest">
                    <MessageSquare className="w-5 h-5" />
                    AI Guide Tooltip System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    <AITooltip
                      content="I'm Harmony, your wise AI guide. I provide balanced insights and help you make informed decisions."
                      personality="harmonix"
                      position="top"
                      showAvatar
                    >
                      <div className="p-4 border border-harmonix-sage/20 rounded-lg cursor-pointer hover:border-jade-forest/40 transition-colors">
                        <div className="text-2xl mb-2">🧠</div>
                        <p className="text-sm font-medium">Harmony Guide</p>
                      </div>
                    </AITooltip>

                    <AITooltip
                      content="Hey there! I'm CA$H, your energetic sales agent. I'll help you close deals and boost your revenue!"
                      personality="cash"
                      position="top"
                      showAvatar
                    >
                      <div className="p-4 border border-harmonix-sage/20 rounded-lg cursor-pointer hover:border-jade-forest/40 transition-colors">
                        <div className="text-2xl mb-2">⚡</div>
                        <p className="text-sm font-medium">CA$H Guide</p>
                      </div>
                    </AITooltip>

                    <AITooltip
                      content="Greetings! I am SŌL, the mystical brain of the Harmonix network. I orchestrate all agent activities with deep wisdom."
                      personality="sol"
                      position="top"
                      showAvatar
                    >
                      <div className="p-4 border border-harmonix-sage/20 rounded-lg cursor-pointer hover:border-jade-forest/40 transition-colors">
                        <div className="text-2xl mb-2">✨</div>
                        <p className="text-sm font-medium">SŌL Guide</p>
                      </div>
                    </AITooltip>

                    <AITooltip
                      content="Hello! I'm Grace, your caring companion. I'm here to support you and make sure you feel welcomed and understood."
                      personality="grace"
                      position="top"
                      showAvatar
                    >
                      <div className="p-4 border border-harmonix-sage/20 rounded-lg cursor-pointer hover:border-jade-forest/40 transition-colors">
                        <div className="text-2xl mb-2">💖</div>
                        <p className="text-sm font-medium">Grace Guide</p>
                      </div>
                    </AITooltip>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-harmonix-sage">Interactive Examples:</h3>
                    <div className="flex flex-wrap gap-4">
                      <AITooltip
                        content="Click me for interactive guidance!"
                        trigger="click"
                        contextual
                        personality="helpful"
                      >
                        <Button variant="outline">Click Tooltip</Button>
                      </AITooltip>

                      <AITooltip
                        content="Focus on me to see instant help!"
                        trigger="focus"
                        personality="atlas"
                      >
                        <Button variant="outline">Focus Tooltip</Button>
                      </AITooltip>

                      <AITooltip
                        content="Hover for contextual assistance!"
                        interactive
                        personality="sol"
                      >
                        <Button variant="outline">Interactive Tooltip</Button>
                      </AITooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!currentDemo && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="text-6xl mb-6"
              >
                ✨
              </motion.div>
              <h2 className="text-2xl font-bold text-jade-forest mb-4">
                Welcome to the Interactive Features Demo
              </h2>
              <p className="text-harmonix-sage/70 mb-8 max-w-2xl mx-auto">
                Click on any feature above to explore the animated micro-interactions, 
                AI character mascots, personalized widgets, theme switching, and contextual tooltip system.
              </p>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge variant="outline" className="text-jade-forest border-jade-forest">
                  Choose a demo to get started!
                </Badge>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}