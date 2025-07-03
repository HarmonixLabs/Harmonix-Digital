import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Target, 
  Clock, 
  Award,
  Heart,
  Brain,
  Sparkles,
  Star,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressAnimationProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  animated?: boolean;
}

function CuteProgressBar({ value, max, label, color = '#1D6B4A', animated = true }: ProgressAnimationProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-harmonix-sage">{label}</span>
        <span className="text-xs text-harmonix-sage/70">{value}/{max}</span>
      </div>
      
      <div className="relative h-3 bg-harmonix-sage/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: animated ? `${percentage}%` : `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        >
          {/* Cute shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'linear',
              delay: 1.8 
            }}
          />
        </motion.div>
        
        {/* Cute bouncing indicator */}
        {percentage > 0 && (
          <motion.div
            className="absolute top-1/2 w-2 h-2 rounded-full bg-white shadow-lg"
            style={{ left: `${Math.max(percentage - 2, 0)}%` }}
            animate={{ 
              y: [-4, -8, -4],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: 2
            }}
          />
        )}
      </div>
    </div>
  );
}

interface PersonalizedWidgetProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  gradient?: string;
  delay?: number;
  className?: string;
}

function PersonalizedWidget({ 
  title, 
  icon, 
  children, 
  gradient = 'from-jade-forest/20 to-harmonix-sage/20',
  delay = 0,
  className 
}: PersonalizedWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: 'spring',
        stiffness: 100 
      }}
      whileHover={{ 
        scale: 1.02,
        y: -2
      }}
      className={cn(
        'p-6 rounded-xl border border-harmonix-sage/20',
        'bg-gradient-to-br',
        gradient,
        'backdrop-blur-sm hover:border-jade-forest/40 transition-all duration-300',
        'group cursor-pointer',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="p-2 rounded-lg bg-jade-forest/20"
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {icon}
        </motion.div>
        <h3 className="font-semibold text-harmonix-sage">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export function AgentPerformanceWidget() {
  const [agents] = useState([
    { name: 'CA$H', performance: 94, tasks: 156, color: '#10B981' },
    { name: 'Grace', performance: 87, tasks: 89, color: '#EC4899' },
    { name: 'Atlas', performance: 91, tasks: 124, color: '#3B82F6' },
    { name: 'SŌL', performance: 98, tasks: 203, color: '#FDC500' }
  ]);

  return (
    <PersonalizedWidget
      title="Agent Performance"
      icon={<Brain className="w-5 h-5 text-jade-forest" />}
      gradient="from-emerald-500/10 to-teal-500/10"
    >
      <div className="space-y-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-harmonix-black/30"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${agent.color}20` }}
                animate={{ 
                  boxShadow: [`0 0 0 ${agent.color}40`, `0 0 10px ${agent.color}40`, `0 0 0 ${agent.color}40`]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" style={{ color: agent.color }} />
              </motion.div>
              <div>
                <p className="font-medium text-harmonix-sage">{agent.name}</p>
                <p className="text-xs text-harmonix-sage/60">{agent.tasks} tasks</p>
              </div>
            </div>
            <motion.div
              className="text-right"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
            >
              <p className="font-bold" style={{ color: agent.color }}>{agent.performance}%</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </PersonalizedWidget>
  );
}

export function TaskCompletionWidget() {
  const [completedTasks, setCompletedTasks] = useState(0);
  const totalTasks = 45;

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedTasks(prev => {
        if (prev < 38) return prev + 1;
        return prev;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <PersonalizedWidget
      title="Today's Progress"
      icon={<Target className="w-5 h-5 text-jade-forest" />}
      gradient="from-blue-500/10 to-purple-500/10"
      delay={0.2}
    >
      <div className="space-y-4">
        <CuteProgressBar
          value={completedTasks}
          max={totalTasks}
          label="Tasks Completed"
          color="#3B82F6"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="text-center p-3 rounded-lg bg-harmonix-black/30"
            whileHover={{ scale: 1.05 }}
          >
            <motion.p
              className="text-2xl font-bold text-blue-400"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {completedTasks}
            </motion.p>
            <p className="text-xs text-harmonix-sage/60">Completed</p>
          </motion.div>
          
          <motion.div
            className="text-center p-3 rounded-lg bg-harmonix-black/30"
            whileHover={{ scale: 1.05 }}
          >
            <motion.p
              className="text-2xl font-bold text-purple-400"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              {totalTasks - completedTasks}
            </motion.p>
            <p className="text-xs text-harmonix-sage/60">Remaining</p>
          </motion.div>
        </div>
      </div>
    </PersonalizedWidget>
  );
}

export function EnergyMeterWidget() {
  const [energy, setEnergy] = useState(0);
  const maxEnergy = 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prev => {
        if (prev < 78) return prev + 2;
        return prev;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const getEnergyColor = () => {
    if (energy < 30) return '#EF4444';
    if (energy < 60) return '#F59E0B';
    return '#10B981';
  };

  const getEnergyEmoji = () => {
    if (energy < 30) return '😴';
    if (energy < 60) return '😊';
    return '⚡';
  };

  return (
    <PersonalizedWidget
      title="Energy Level"
      icon={<Zap className="w-5 h-5 text-jade-forest" />}
      gradient="from-yellow-500/10 to-orange-500/10"
      delay={0.4}
    >
      <div className="space-y-4">
        <div className="text-center">
          <motion.div
            className="text-4xl mb-2"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {getEnergyEmoji()}
          </motion.div>
          <motion.p
            className="text-3xl font-bold"
            style={{ color: getEnergyColor() }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {energy}%
          </motion.p>
        </div>
        
        <CuteProgressBar
          value={energy}
          max={maxEnergy}
          label="Daily Energy"
          color={getEnergyColor()}
        />
        
        <motion.div
          className="text-center text-sm text-harmonix-sage/70"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {energy > 70 ? '🔥 On fire!' : energy > 40 ? '💪 Feeling good!' : '☕ Need a break?'}
        </motion.div>
      </div>
    </PersonalizedWidget>
  );
}

export function AchievementWidget() {
  const [achievements] = useState([
    { name: 'First Agent', icon: '🤖', unlocked: true, rarity: 'common' },
    { name: 'Task Master', icon: '🏆', unlocked: true, rarity: 'rare' },
    { name: 'Speed Demon', icon: '⚡', unlocked: false, rarity: 'epic' },
    { name: 'AI Whisperer', icon: '🧙‍♂️', unlocked: false, rarity: 'legendary' }
  ]);

  const rarityColors: Record<string, string> = {
    common: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };

  return (
    <PersonalizedWidget
      title="Achievements"
      icon={<Award className="w-5 h-5 text-jade-forest" />}
      gradient="from-purple-500/10 to-pink-500/10"
      delay={0.6}
    >
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              'p-3 rounded-lg text-center transition-all duration-300',
              achievement.unlocked 
                ? 'bg-harmonix-black/30 border border-jade-forest/20' 
                : 'bg-harmonix-sage/5 border border-harmonix-sage/10 opacity-50'
            )}
          >
            <motion.div
              className="text-2xl mb-1"
              animate={achievement.unlocked ? {
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
            >
              {achievement.icon}
            </motion.div>
            <p className="text-xs font-medium text-harmonix-sage">{achievement.name}</p>
            <motion.div
              className="w-2 h-1 mx-auto mt-1 rounded-full"
              style={{ backgroundColor: rarityColors[achievement.rarity] }}
              animate={achievement.unlocked ? {
                opacity: [0.5, 1, 0.5]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>
    </PersonalizedWidget>
  );
}

export function QuickStatsWidget() {
  const [stats] = useState({
    totalAgents: 4,
    activeProjects: 12,
    completionRate: 94,
    userRank: 'Elite'
  });

  return (
    <PersonalizedWidget
      title="Quick Stats"
      icon={<BarChart3 className="w-5 h-5 text-jade-forest" />}
      gradient="from-teal-500/10 to-cyan-500/10"
      delay={0.8}
    >
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Agents', value: stats.totalAgents, icon: Brain, color: '#1D6B4A' },
          { label: 'Projects', value: stats.activeProjects, icon: Users, color: '#3B82F6' },
          { label: 'Success Rate', value: `${stats.completionRate}%`, icon: TrendingUp, color: '#10B981' },
          { label: 'Rank', value: stats.userRank, icon: Star, color: '#F59E0B' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-harmonix-black/30 text-center"
          >
            <motion.div
              className="flex justify-center mb-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </motion.div>
            <motion.p
              className="font-bold"
              style={{ color: stat.color }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            >
              {stat.value}
            </motion.p>
            <p className="text-xs text-harmonix-sage/60">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </PersonalizedWidget>
  );
}