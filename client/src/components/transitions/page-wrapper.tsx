import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ParallaxBackground, SacredGeometryBG } from './parallax-background';

interface PageWrapperProps {
  children: ReactNode;
  enableParallax?: boolean;
  enableGeometry?: boolean;
  className?: string;
}

export function PageWrapper({ 
  children, 
  enableParallax = true, 
  enableGeometry = true,
  className = '' 
}: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={`relative min-h-screen ${className}`}
    >
      {/* Sacred geometry background */}
      {enableGeometry && <SacredGeometryBG />}
      
      {/* Page content with optional parallax */}
      {enableParallax ? (
        <ParallaxBackground speed={0.3}>
          {children}
        </ParallaxBackground>
      ) : (
        children
      )}
    </motion.div>
  );
}

// Enhanced stagger animations
export const pageStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const pageItem = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      mass: 0.8,
    },
  },
};

// Sacred card entrance animation
export const sacredCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    rotateX: -15,
    scale: 0.9,
  },
  show: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      mass: 0.8,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    rotateX: 5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

// Reveal text animation
export const textReveal = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

// Button hover effects with sacred energy
export const sacredButtonVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 0 0 rgba(215, 183, 109, 0)',
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 0 20px 4px rgba(215, 183, 109, 0.3)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};