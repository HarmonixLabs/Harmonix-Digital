import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, Heart, Star } from 'lucide-react';

interface AILoadingSkeletonProps {
  variant?: 'harmonix' | 'sol' | 'grace' | 'cash' | 'atlas';
  message?: string;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AILoadingSkeleton({
  variant = 'harmonix',
  message = 'AI is thinking...',
  progress = 0,
  size = 'md'
}: AILoadingSkeletonProps) {
  const mascots = {
    harmonix: {
      icon: Brain,
      color: '#1D6B4A',
      accent: '#39FF14',
      personality: 'wise',
      animation: 'pulse'
    },
    sol: {
      icon: Sparkles,
      color: '#FDC500',
      accent: '#FFE55C',
      personality: 'mystical',
      animation: 'sparkle'
    },
    grace: {
      icon: Heart,
      color: '#EC4899',
      accent: '#F472B6',
      personality: 'caring',
      animation: 'heartbeat'
    },
    cash: {
      icon: Zap,
      color: '#10B981',
      accent: '#34D399',
      personality: 'energetic',
      animation: 'lightning'
    },
    atlas: {
      icon: Star,
      color: '#3B82F6',
      accent: '#60A5FA',
      personality: 'strong',
      animation: 'orbit'
    }
  };

  const config = mascots[variant];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const containerSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
      {/* AI Mascot with Personality Animations */}
      <div className="relative mb-4">
        <motion.div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative overflow-hidden`}
          style={{
            background: `linear-gradient(135deg, ${config.color}20, ${config.accent}20)`,
            border: `2px solid ${config.color}40`
          }}
          animate={{
            scale: config.animation === 'pulse' ? [1, 1.1, 1] : 1,
            rotate: config.animation === 'orbit' ? [0, 360] : 0
          }}
          transition={{
            duration: config.animation === 'pulse' ? 2 : config.animation === 'orbit' ? 4 : 1,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Animated Background Glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${config.accent}40, transparent 70%)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Mascot Icon with Special Animations */}
          <motion.div
            animate={{
              scale: config.animation === 'heartbeat' ? [1, 1.2, 1] : 1,
              rotate: config.animation === 'sparkle' ? [0, 10, -10, 0] : 0,
              y: config.animation === 'lightning' ? [0, -2, 0] : 0
            }}
            transition={{
              duration: config.animation === 'heartbeat' ? 0.8 : 
                        config.animation === 'sparkle' ? 2 : 
                        config.animation === 'lightning' ? 0.5 : 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <IconComponent 
              className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'}`}
              style={{ color: config.color }}
            />
          </motion.div>

          {/* Floating Particles */}
          {config.animation === 'sparkle' && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: config.accent }}
                  animate={{
                    x: [0, 20, -20, 0],
                    y: [0, -20, 20, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Orbiting Elements for Atlas */}
        {config.animation === 'orbit' && (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            <div 
              className="absolute w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: config.accent,
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />
            <div 
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ 
                backgroundColor: config.color,
                bottom: '10%',
                right: '20%'
              }}
            />
          </motion.div>
        )}
      </div>

      {/* AI Message with Typing Animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <motion.p
          className="text-harmonix-sage font-medium"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
        
        {/* Typing Dots */}
        <div className="flex justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.color }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Progress Bar with Pulse */}
      {progress > 0 && (
        <div className="w-full max-w-xs">
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <motion.div
              className="h-full rounded-full relative"
              style={{ backgroundColor: config.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Animated Shimmer Effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${config.accent}80, transparent)`
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </motion.div>
          </div>
          
          <motion.p
            className="text-xs text-harmonix-sage/70 text-center mt-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {Math.round(progress)}% complete
          </motion.p>
        </div>
      )}
    </div>
  );
}

// Skeleton Placeholders with AI Personality
export function AIContentSkeleton({ variant = 'harmonix', lines = 3 }: { variant?: AILoadingSkeletonProps['variant'], lines?: number }) {
  const mascots = {
    harmonix: { color: '#1D6B4A', accent: '#39FF14' },
    sol: { color: '#FDC500', accent: '#FFE55C' },
    grace: { color: '#EC4899', accent: '#F472B6' },
    cash: { color: '#10B981', accent: '#34D399' },
    atlas: { color: '#3B82F6', accent: '#60A5FA' }
  };
  const config = mascots[variant];
  
  return (
    <div className="space-y-3">
      {[...Array(lines)].map((_, i) => (
        <motion.div
          key={i}
          className="h-4 rounded-lg"
          style={{ backgroundColor: `${config.color}20` }}
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3
          }}
        >
          <motion.div
            className="h-full rounded-lg"
            style={{
              background: `linear-gradient(90deg, transparent, ${config.accent}40, transparent)`
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.1
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// AI Card Skeleton
export function AICardSkeleton({ variant = 'harmonix' }: { variant?: AILoadingSkeletonProps['variant'] }) {
  const mascots = {
    harmonix: { color: '#1D6B4A', accent: '#39FF14' },
    sol: { color: '#FDC500', accent: '#FFE55C' },
    grace: { color: '#EC4899', accent: '#F472B6' },
    cash: { color: '#10B981', accent: '#34D399' },
    atlas: { color: '#3B82F6', accent: '#60A5FA' }
  };
  const config = mascots[variant];
  
  return (
    <motion.div
      className="p-6 rounded-xl border border-harmonix-sage/20 bg-harmonix-night"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-10 h-10 rounded-full"
          style={{ backgroundColor: `${config.color}30` }}
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
        <div className="space-y-2 flex-1">
          <motion.div
            className="h-4 w-32 rounded"
            style={{ backgroundColor: `${config.color}20` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="h-3 w-24 rounded"
            style={{ backgroundColor: `${config.color}15` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </div>
      <AIContentSkeleton variant={variant} lines={2} />
    </motion.div>
  );
}