import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const overlayVariants = {
  initial: {
    scaleY: 0,
    transformOrigin: 'bottom',
  },
  animate: {
    scaleY: 1,
    transformOrigin: 'bottom',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: {
    scaleY: 0,
    transformOrigin: 'top',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      delay: 0.1,
    },
  },
};

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={`min-h-screen ${className}`}
      >
        {/* Sacred transition overlay */}
        <motion.div
          className="fixed inset-0 bg-gradient-to-b from-harmonix-sage/5 to-harmonix-cedar/10 pointer-events-none z-50"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
        
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Stagger animation for child elements
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 20,
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
    },
  },
};

// Sacred geometry loading transition
export function SacredLoader() {
  return (
    <motion.div
      className="fixed inset-0 bg-harmonix-black/90 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-16 h-16"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Sacred geometry pattern */}
        <motion.div
          className="absolute inset-0 border-2 border-harmonix-gold/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-2 border border-harmonix-sage/50 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        <div className="absolute inset-6 bg-harmonix-gold/20 rounded-full" />
      </motion.div>
    </motion.div>
  );
}