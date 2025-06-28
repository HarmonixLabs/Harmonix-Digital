import React from 'react';
import { cn } from '@/lib/utils';

interface CharacterAvatarProps {
  character: {
    name: string;
    role: string;
    personality: string;
  };
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function CharacterAvatar({ character, size = 'md', animated = true }: CharacterAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'
  };

  const getCharacterIcon = (name: string) => {
    const icons = {
      harmony: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="harmonyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--harmonix-regal-gold)" />
              <stop offset="100%" stopColor="var(--harmonix-gold-bright)" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#harmonyGrad)" />
          <circle cx="32" cy="24" r="8" fill="var(--harmonix-deep-forest)" />
          <path d="M18 42 Q32 48 46 42" stroke="var(--harmonix-deep-forest)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="24" cy="28" r="2" fill="var(--harmonix-deep-forest)" />
          <circle cx="40" cy="28" r="2" fill="var(--harmonix-deep-forest)" />
        </svg>
      ),
      sage: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--harmonix-cedar-mist)" />
              <stop offset="100%" stopColor="var(--harmonix-sage-fade)" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#sageGrad)" />
          <rect x="24" y="16" width="16" height="12" rx="2" fill="var(--harmonix-deep-forest)" />
          <circle cx="32" cy="36" r="6" fill="var(--harmonix-deep-forest)" />
          <path d="M20 44 Q32 40 44 44" stroke="var(--harmonix-deep-forest)" strokeWidth="2" fill="none" />
          <circle cx="28" cy="22" r="1.5" fill="var(--harmonix-regal-gold)" />
          <circle cx="36" cy="22" r="1.5" fill="var(--harmonix-regal-gold)" />
        </svg>
      ),
      phoenix: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="phoenixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--harmonix-regal-gold)" />
              <stop offset="50%" stopColor="var(--harmonix-gold-bright)" />
              <stop offset="100%" stopColor="var(--harmonix-regal-gold)" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#phoenixGrad)" />
          <path d="M16 20 Q32 12 48 20 Q32 28 16 20" fill="var(--harmonix-deep-forest)" />
          <circle cx="32" cy="32" r="10" fill="var(--harmonix-deep-forest)" />
          <path d="M22 48 Q32 44 42 48" stroke="var(--harmonix-deep-forest)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="28" cy="28" r="2" fill="var(--harmonix-regal-gold)" />
          <circle cx="36" cy="28" r="2" fill="var(--harmonix-regal-gold)" />
        </svg>
      ),
      atlas: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="atlasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--harmonix-sage-fade)" />
              <stop offset="100%" stopColor="var(--harmonix-cedar-mist)" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#atlasGrad)" />
          <rect x="20" y="20" width="24" height="24" rx="4" fill="var(--harmonix-deep-forest)" />
          <rect x="24" y="24" width="4" height="4" fill="var(--harmonix-regal-gold)" />
          <rect x="32" y="24" width="4" height="4" fill="var(--harmonix-regal-gold)" />
          <rect x="28" y="32" width="8" height="4" rx="2" fill="var(--harmonix-regal-gold)" />
          <rect x="24" y="38" width="16" height="2" rx="1" fill="var(--harmonix-regal-gold)" />
        </svg>
      )
    };

    return icons[name.toLowerCase() as keyof typeof icons] || icons.harmony;
  };

  return (
    <div className={cn(
      "relative flex-shrink-0 border-2 border-harmonix-regal-gold/50 rounded-full overflow-hidden",
      sizeClasses[size],
      animated && "transition-all duration-300 hover:scale-110 hover:border-harmonix-regal-gold"
    )}>
      <div className={cn(
        "w-full h-full bg-gradient-to-br from-harmonix-night-pine to-harmonix-deep-forest flex items-center justify-center",
        animated && "group-hover:from-harmonix-cedar-mist/20 group-hover:to-harmonix-night-pine/80"
      )}>
        {getCharacterIcon(character.name)}
      </div>
      
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-harmonix-regal-gold/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full" />
      )}
    </div>
  );
}