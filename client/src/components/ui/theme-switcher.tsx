import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Sparkles,
  Zap,
  Leaf,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'auto' | 'harmonix' | 'sol' | 'cash' | 'nature';

interface ThemeConfig {
  name: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  gradient: string;
}

const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: 'Light',
    icon: <Sun className="w-4 h-4" />,
    colors: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      background: '#ffffff',
      text: '#0f172a',
      accent: '#3b82f6'
    },
    gradient: 'from-white to-gray-50'
  },
  dark: {
    name: 'Dark',
    icon: <Moon className="w-4 h-4" />,
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      background: '#020617',
      text: '#f1f5f9',
      accent: '#6366f1'
    },
    gradient: 'from-slate-900 to-slate-800'
  },
  auto: {
    name: 'Auto',
    icon: <Monitor className="w-4 h-4" />,
    colors: {
      primary: '#1e293b',
      secondary: '#334155',
      background: '#0f172a',
      text: '#e2e8f0',
      accent: '#8b5cf6'
    },
    gradient: 'from-slate-800 to-slate-700'
  },
  harmonix: {
    name: 'Harmonix',
    icon: <Sparkles className="w-4 h-4" />,
    colors: {
      primary: '#0b0f0e',
      secondary: '#111f1a',
      background: '#0b0f0e',
      text: '#768b7c',
      accent: '#1D6B4A'
    },
    gradient: 'from-harmonix-black to-harmonix-night'
  },
  sol: {
    name: 'SŌL',
    icon: <Zap className="w-4 h-4" />,
    colors: {
      primary: '#1a1a1a',
      secondary: '#2a2a2a',
      background: '#0a0a0a',
      text: '#fbbf24',
      accent: '#FDC500'
    },
    gradient: 'from-yellow-900 to-amber-900'
  },
  cash: {
    name: 'CA$H',
    icon: <Flame className="w-4 h-4" />,
    colors: {
      primary: '#064e3b',
      secondary: '#065f46',
      background: '#022c22',
      text: '#6ee7b7',
      accent: '#10B981'
    },
    gradient: 'from-emerald-900 to-green-900'
  },
  nature: {
    name: 'Nature',
    icon: <Leaf className="w-4 h-4" />,
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      background: '#111827',
      text: '#86efac',
      accent: '#22c55e'
    },
    gradient: 'from-green-900 to-emerald-900'
  }
};

interface ThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'compact' | 'expanded' | 'floating';
}

export function ThemeSwitcher({ 
  className, 
  size = 'md', 
  variant = 'compact' 
}: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('harmonix');
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('harmonix-theme') as Theme;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const config = themes[theme];
    const root = document.documentElement;
    
    // Apply CSS custom properties for smooth transitions
    root.style.setProperty('--theme-primary', config.colors.primary);
    root.style.setProperty('--theme-secondary', config.colors.secondary);
    root.style.setProperty('--theme-background', config.colors.background);
    root.style.setProperty('--theme-text', config.colors.text);
    root.style.setProperty('--theme-accent', config.colors.accent);
    
    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
  };

  const handleThemeChange = async (theme: Theme) => {
    if (theme === currentTheme) return;
    
    setIsTransitioning(true);
    
    // Smooth transition effect
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('harmonix-theme', theme);
    setIsOpen(false);
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const currentConfig = themes[currentTheme];

  if (variant === 'floating') {
    return (
      <div className={cn('fixed bottom-6 right-6 z-50', className)}>
        <motion.button
          className={cn(
            'rounded-full shadow-lg backdrop-blur-sm border',
            'flex items-center justify-center transition-all duration-300',
            sizeClasses[size]
          )}
          style={{
            backgroundColor: `${currentConfig.colors.primary}90`,
            borderColor: `${currentConfig.colors.accent}40`,
            color: currentConfig.colors.text
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={isTransitioning ? { rotate: 360 } : {}}
            transition={{ duration: 0.3 }}
          >
            {currentConfig.icon}
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-full right-0 mb-4 p-2 rounded-xl shadow-xl backdrop-blur-sm border border-harmonix-sage/20"
              style={{ backgroundColor: `${currentConfig.colors.primary}95` }}
            >
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(themes).map(([key, config]) => (
                  <ThemeOption
                    key={key}
                    theme={key as Theme}
                    config={config}
                    isActive={currentTheme === key}
                    onClick={() => handleThemeChange(key as Theme)}
                    size="sm"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className={cn('p-4 rounded-xl border border-harmonix-sage/20 bg-harmonix-night', className)}>
        <h3 className="text-sm font-medium text-harmonix-sage mb-3">Choose Theme</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(themes).map(([key, config]) => (
            <ThemeOption
              key={key}
              theme={key as Theme}
              config={config}
              isActive={currentTheme === key}
              onClick={() => handleThemeChange(key as Theme)}
              showLabel
            />
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  return (
    <div className={cn('relative', className)}>
      <motion.button
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-harmonix-night border border-harmonix-sage/20',
          'hover:border-jade-forest/40 transition-all duration-300',
          'text-harmonix-sage'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={isTransitioning ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {currentConfig.icon}
        </motion.div>
        <span className="text-sm font-medium">{currentConfig.name}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 p-2 rounded-xl shadow-xl backdrop-blur-sm border border-harmonix-sage/20 bg-harmonix-night z-50 min-w-[200px]"
          >
            <div className="space-y-1">
              {Object.entries(themes).map(([key, config]) => (
                <motion.button
                  key={key}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200',
                    currentTheme === key 
                      ? 'bg-jade-forest/20 border border-jade-forest/40' 
                      : 'hover:bg-harmonix-sage/10'
                  )}
                  whileHover={{ x: 2 }}
                  onClick={() => handleThemeChange(key as Theme)}
                >
                  <motion.div
                    className="flex items-center justify-center w-6 h-6 rounded"
                    style={{ backgroundColor: `${config.colors.accent}20` }}
                    animate={currentTheme === key ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {React.cloneElement(config.icon as React.ReactElement, {
                      style: { color: config.colors.accent }
                    })}
                  </motion.div>
                  <span className="text-sm font-medium text-harmonix-sage">
                    {config.name}
                  </span>
                  {currentTheme === key && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 rounded-full bg-jade-forest"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ThemeOptionProps {
  theme: Theme;
  config: ThemeConfig;
  isActive: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

function ThemeOption({ 
  theme, 
  config, 
  isActive, 
  onClick, 
  size = 'md',
  showLabel = false 
}: ThemeOptionProps) {
  return (
    <motion.button
      className={cn(
        'p-3 rounded-lg border-2 transition-all duration-300 text-center',
        isActive 
          ? 'border-jade-forest shadow-lg' 
          : 'border-harmonix-sage/20 hover:border-harmonix-sage/40'
      )}
      style={{
        background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.div
        className="flex flex-col items-center gap-2"
        animate={isActive ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div 
          className={cn(
            'rounded-full flex items-center justify-center',
            size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
          )}
          style={{ 
            backgroundColor: `${config.colors.accent}20`,
            color: config.colors.accent
          }}
        >
          {config.icon}
        </div>
        {showLabel && (
          <span 
            className="text-xs font-medium"
            style={{ color: config.colors.text }}
          >
            {config.name}
          </span>
        )}
      </motion.div>
      
      {/* Preview colors */}
      <div className="flex justify-center gap-1 mt-2">
        {[config.colors.primary, config.colors.accent, config.colors.text].map((color, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
    </motion.button>
  );
}