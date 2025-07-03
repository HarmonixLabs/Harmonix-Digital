import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Brain, 
  Sparkles, 
  Heart, 
  Zap, 
  Star,
  MessageCircle,
  ChevronDown,
  X,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AIPersonality = 'harmonix' | 'sol' | 'grace' | 'cash' | 'atlas' | 'helpful';

interface AIGuide {
  personality: AIPersonality;
  name: string;
  icon: React.ReactNode;
  color: string;
  accent: string;
  style: string;
}

const aiGuides: Record<AIPersonality, AIGuide> = {
  harmonix: {
    personality: 'harmonix',
    name: 'Harmony',
    icon: <Brain className="w-4 h-4" />,
    color: '#1D6B4A',
    accent: '#39FF14',
    style: 'wise and balanced'
  },
  sol: {
    personality: 'sol',
    name: 'SŌL',
    icon: <Sparkles className="w-4 h-4" />,
    color: '#FDC500',
    accent: '#FFE55C',
    style: 'mystical and insightful'
  },
  grace: {
    personality: 'grace',
    name: 'Grace',
    icon: <Heart className="w-4 h-4" />,
    color: '#EC4899',
    accent: '#F472B6',
    style: 'caring and supportive'
  },
  cash: {
    personality: 'cash',
    name: 'CA$H',
    icon: <Zap className="w-4 h-4" />,
    color: '#10B981',
    accent: '#34D399',
    style: 'energetic and direct'
  },
  atlas: {
    personality: 'atlas',
    name: 'Atlas',
    icon: <Star className="w-4 h-4" />,
    color: '#3B82F6',
    accent: '#60A5FA',
    style: 'strong and reliable'
  },
  helpful: {
    personality: 'helpful',
    name: 'Helper',
    icon: <Lightbulb className="w-4 h-4" />,
    color: '#8B5CF6',
    accent: '#C4B5FD',
    style: 'friendly and informative'
  }
};

interface AITooltipProps {
  content: string;
  children: React.ReactNode;
  personality?: AIPersonality;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  interactive?: boolean;
  showAvatar?: boolean;
  contextual?: boolean;
  className?: string;
}

export function AITooltip({
  content,
  children,
  personality = 'helpful',
  position = 'top',
  trigger = 'hover',
  delay = 500,
  interactive = false,
  showAvatar = true,
  contextual = false,
  className
}: AITooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const guide = aiGuides[personality];

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, trigger === 'hover' ? delay : 0);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!interactive) {
      setIsVisible(false);
      setIsAnimating(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
      setIsAnimating(!isVisible);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn('relative inline-block', className)}
      onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
      onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
      onClick={handleClick}
      onFocus={trigger === 'focus' ? showTooltip : undefined}
      onBlur={trigger === 'focus' ? hideTooltip : undefined}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'absolute z-50 pointer-events-auto',
              getPositionClasses()
            )}
            onMouseEnter={interactive ? () => setIsVisible(true) : undefined}
            onMouseLeave={interactive ? hideTooltip : undefined}
          >
            {/* Tooltip Content */}
            <motion.div
              className="relative max-w-xs p-4 rounded-xl shadow-xl backdrop-blur-sm border"
              style={{
                backgroundColor: `${guide.color}15`,
                borderColor: `${guide.color}30`
              }}
              animate={isAnimating ? {
                boxShadow: [
                  `0 0 0 0 ${guide.color}40`,
                  `0 0 0 4px ${guide.color}20`,
                  `0 0 0 0 ${guide.color}40`
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* AI Guide Header */}
              {showAvatar && (
                <motion.div
                  className="flex items-center gap-2 mb-3 pb-2 border-b"
                  style={{ borderColor: `${guide.color}20` }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${guide.color}20` }}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {React.cloneElement(guide.icon as React.ReactElement, {
                      style: { color: guide.color }
                    })}
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-harmonix-sage">{guide.name}</p>
                    <p className="text-xs text-harmonix-sage/60">{guide.style}</p>
                  </div>
                </motion.div>
              )}

              {/* Tooltip Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: showAvatar ? 0.3 : 0.1 }}
              >
                <p className="text-sm text-harmonix-sage leading-relaxed">{content}</p>
              </motion.div>

              {/* Contextual Actions */}
              {contextual && (
                <motion.div
                  className="mt-3 pt-2 border-t flex gap-2"
                  style={{ borderColor: `${guide.color}20` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${guide.color}20`,
                      color: guide.color
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                  <motion.button
                    className="text-xs px-2 py-1 rounded border"
                    style={{ 
                      borderColor: `${guide.color}30`,
                      color: guide.color
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Got it!
                  </motion.button>
                </motion.div>
              )}

              {/* Close button for click trigger */}
              {trigger === 'click' && (
                <motion.button
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${guide.color}20` }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVisible(false);
                    setIsAnimating(false);
                  }}
                >
                  <X className="w-3 h-3" style={{ color: guide.color }} />
                </motion.button>
              )}
            </motion.div>

            {/* Animated particles for Sol personality */}
            {personality === 'sol' && isAnimating && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ backgroundColor: guide.accent }}
                    animate={{
                      x: [0, 20, -20, 0],
                      y: [0, -20, 20, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.7
                    }}
                  />
                ))}
              </>
            )}

            {/* Heartbeat animation for Grace */}
            {personality === 'grace' && isAnimating && (
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: guide.accent }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Smart Tooltip Hook for contextual guidance
export function useSmartTooltip() {
  const [currentPage, setCurrentPage] = useState('');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, []);

  const getContextualContent = (element: string): { content: string; personality: AIPersonality } => {
    // Page-specific guidance
    const pageGuidance: Record<string, Record<string, { content: string; personality: AIPersonality }>> = {
      '/dashboard': {
        'agents': {
          content: "Your AI agents are the heart of your automation. Each one has unique skills and can work together to handle complex tasks!",
          personality: 'harmonix'
        },
        'tasks': {
          content: "Track your agent's progress here. Watch them work their magic in real-time!",
          personality: 'cash'
        },
        'performance': {
          content: "I'm monitoring your agents' performance. They're learning and improving every day!",
          personality: 'sol'
        }
      },
      '/marketplace': {
        'agents': {
          content: "Discover amazing agents created by our community. Each one is unique and ready to help!",
          personality: 'grace'
        },
        'create': {
          content: "Ready to build your own agent? I'll guide you through every step of the process!",
          personality: 'atlas'
        }
      }
    };

    const guidance = pageGuidance[currentPage]?.[element];
    return guidance || {
      content: "I'm here to help! Hover over elements to learn more about how they work.",
      personality: 'helpful'
    };
  };

  return { getContextualContent, userLevel, setUserLevel };
}

// Quick Help Button Component
export function AIHelpButton({ 
  className,
  personality = 'helpful' 
}: { 
  className?: string;
  personality?: AIPersonality;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const guide = aiGuides[personality];

  return (
    <div className={cn('relative', className)}>
      <motion.button
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border"
        style={{
          backgroundColor: `${guide.color}20`,
          borderColor: `${guide.color}40`
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <MessageCircle className="w-5 h-5" style={{ color: guide.color }} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full right-0 mb-2 w-72 p-4 rounded-xl shadow-xl backdrop-blur-sm border"
            style={{
              backgroundColor: `${guide.color}15`,
              borderColor: `${guide.color}30`
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${guide.color}20` }}
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {guide.icon}
              </motion.div>
              <div>
                <h3 className="font-medium text-harmonix-sage">{guide.name} Assistant</h3>
                <p className="text-xs text-harmonix-sage/60">Always here to help!</p>
              </div>
            </div>
            
            <p className="text-sm text-harmonix-sage mb-3">
              Need help? I can guide you through any feature on this page. Just ask!
            </p>
            
            <motion.button
              className="w-full py-2 px-3 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: `${guide.color}20`,
                color: guide.color
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Interactive Tour
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}