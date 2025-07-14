import React from 'react';

interface HarmonixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'mark';
}

export const HarmonixLogo: React.FC<HarmonixLogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'icon' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const LogoSVG = () => (
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClasses[size]} ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Harmonix circular logo with H design */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        stroke="#D1BFA7" 
        strokeWidth="4" 
        fill="transparent"
      />
      {/* Vertical line */}
      <line 
        x1="50" 
        y1="15" 
        x2="50" 
        y2="85" 
        stroke="#D1BFA7" 
        strokeWidth="4"
      />
      {/* Horizontal crossbar */}
      <line 
        x1="20" 
        y1="50" 
        x2="80" 
        y2="50" 
        stroke="#D1BFA7" 
        strokeWidth="4"
      />
      {/* Lower horizontal section */}
      <line 
        x1="50" 
        y1="50" 
        x2="80" 
        y2="65" 
        stroke="#D1BFA7" 
        strokeWidth="4"
      />
      {/* Corner detail */}
      <path 
        d="M65 35 Q75 35 75 45" 
        stroke="#D1BFA7" 
        strokeWidth="3" 
        fill="none"
      />
    </svg>
  );

  if (variant === 'full') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <LogoSVG />
        <span className="text-2xl font-bold text-[#D1BFA7] font-playfair">
          HARMONIX
        </span>
      </div>
    );
  }

  return <LogoSVG />;
};

export default HarmonixLogo;