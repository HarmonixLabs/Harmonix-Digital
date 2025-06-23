import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";

// Fade In Animation
export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number; 
  duration?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Scale In Animation
export const ScaleIn = ({ 
  children, 
  delay = 0,
  scale = 0.8,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number;
  scale?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide In from Direction
export const SlideIn = ({ 
  children, 
  direction = "left",
  delay = 0,
  distance = 50,
  className = ""
}: { 
  children: ReactNode; 
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  distance?: number;
  className?: string;
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "left": return { x: -distance, y: 0 };
      case "right": return { x: distance, y: 0 };
      case "up": return { x: 0, y: -distance };
      case "down": return { x: 0, y: distance };
      default: return { x: -distance, y: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Children Animation
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  className = ""
}: { 
  children: ReactNode; 
  staggerDelay?: number;
  className?: string;
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Hover Scale Animation
export const HoverScale = ({ 
  children, 
  scale = 1.05,
  className = ""
}: { 
  children: ReactNode; 
  scale?: number;
  className?: string;
}) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Pulse Animation
export const Pulse = ({ 
  children, 
  scale = 1.05,
  className = ""
}: { 
  children: ReactNode; 
  scale?: number;
  className?: string;
}) => (
  <motion.div
    animate={{ scale: [1, scale, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Breathing Animation (sacred effect)
export const BreathingGlow = ({ 
  children, 
  className = ""
}: { 
  children: ReactNode; 
  className?: string;
}) => (
  <motion.div
    animate={{
      boxShadow: [
        "0 0 20px rgba(215, 183, 109, 0.3)",
        "0 0 40px rgba(215, 183, 109, 0.6)",
        "0 0 20px rgba(215, 183, 109, 0.3)"
      ]
    }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Card Flip Animation
export const FlipCard = ({ 
  front, 
  back, 
  className = ""
}: { 
  front: ReactNode; 
  back: ReactNode;
  className?: string;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div
        className="absolute inset-0 backface-hidden"
        style={{ backfaceVisibility: "hidden" }}
      >
        {front}
      </div>
      <div
        className="absolute inset-0 backface-hidden"
        style={{ 
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)"
        }}
      >
        {back}
      </div>
    </motion.div>
  );
};

// Sacred Geometry Animation
export const SacredGeometry = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`absolute inset-0 pointer-events-none ${className}`}
    initial={{ opacity: 0, rotate: 0 }}
    animate={{ opacity: 0.1, rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <motion.circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.polygon
        points="50,30 65,55 35,55"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
      />
    </svg>
  </motion.div>
);

// Floating Animation
export const FloatingElement = ({ 
  children, 
  amplitude = 10,
  duration = 3,
  className = ""
}: { 
  children: ReactNode; 
  amplitude?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    animate={{ y: [-amplitude, amplitude, -amplitude] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Page Transition
export const PageTransition = ({ children }: { children: ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

// Sacred Button Animation
export const SacredButton = ({ 
  children, 
  onClick,
  className = "",
  disabled = false
}: { 
  children: ReactNode; 
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => (
  <motion.button
    className={`relative overflow-hidden ${className}`}
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    animate={{
      boxShadow: [
        "0 0 10px rgba(215, 183, 109, 0.2)",
        "0 0 20px rgba(215, 183, 109, 0.4)",
        "0 0 10px rgba(215, 183, 109, 0.2)"
      ]
    }}
    transition={{ 
      scale: { duration: 0.2 },
      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      initial={{ x: "-100%" }}
      whileHover={{ x: "100%" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    />
    {children}
  </motion.button>
);

// Loading Spinner with Sacred Geometry
export const SacredLoader = ({ size = 40, className = "" }: { size?: number; className?: string }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-2 border-harmonix-gold/30 rounded-full" />
      <motion.div
        className="absolute inset-1 border-2 border-harmonix-gold rounded-full border-t-transparent"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-harmonix-gold rounded-full animate-pulse" />
      </div>
    </motion.div>
  </div>
);

// Toast Notification Animation
export const AnimatedToast = ({ 
  children, 
  isVisible,
  onClose,
  className = ""
}: { 
  children: ReactNode; 
  isVisible: boolean;
  onClose?: () => void;
  className?: string;
}) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed top-4 right-4 z-50 ${className}`}
        onClick={onClose}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);