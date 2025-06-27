import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  variant?: "default" | "mystical" | "neural" | "sacred";
  delay?: number;
  className?: string;
}

export function AnimatedTooltip({
  children,
  content,
  side = "top",
  variant = "mystical",
  delay = 300,
  className
}: AnimatedTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  let hoverTimer: NodeJS.Timeout;

  const handleMouseEnter = () => {
    hoverTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer);
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (side) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  const getAnimationDirection = () => {
    switch (side) {
      case "top":
        return { y: 10, opacity: 0 };
      case "bottom":
        return { y: -10, opacity: 0 };
      case "left":
        return { x: 10, opacity: 0 };
      case "right":
        return { x: -10, opacity: 0 };
      default:
        return { y: 10, opacity: 0 };
    }
  };

  const getArrowClasses = () => {
    switch (side) {
      case "top":
        return "top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent";
      case "bottom":
        return "bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent";
      case "left":
        return "left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent";
      case "right":
        return "right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent";
      default:
        return "top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent";
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "mystical":
        return {
          background: "bg-gradient-to-br from-charcoal-deep/95 via-jade-forest/10 to-charcoal-deep/95",
          border: "border border-jade-forest/40",
          text: "text-jade-forest",
          shadow: "shadow-2xl shadow-jade-forest/20",
          backdropBlur: "backdrop-blur-md",
          arrowColor: "border-t-jade-forest/40"
        };
      case "neural":
        return {
          background: "bg-gradient-to-br from-charcoal-deep/95 via-golden-sovereign/5 to-charcoal-deep/95",
          border: "border border-golden-sovereign/40",
          text: "text-golden-sovereign",
          shadow: "shadow-2xl shadow-golden-sovereign/20",
          backdropBlur: "backdrop-blur-md",
          arrowColor: "border-t-golden-sovereign/40"
        };
      case "sacred":
        return {
          background: "bg-gradient-to-br from-jade-forest/95 via-harmonix-gold/10 to-jade-forest/95",
          border: "border border-harmonix-gold/60",
          text: "text-harmonix-gold",
          shadow: "shadow-2xl shadow-harmonix-gold/30",
          backdropBlur: "backdrop-blur-sm",
          arrowColor: "border-t-jade-forest/95"
        };
      default:
        return {
          background: "bg-deep-space-black/95",
          border: "border border-jade-forest/30",
          text: "text-jade-forest",
          shadow: "shadow-lg shadow-black/20",
          backdropBlur: "backdrop-blur-sm",
          arrowColor: "border-t-deep-space-black/95"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={getAnimationDirection()}
            animate={{ 
              y: 0, 
              x: 0, 
              opacity: 1,
              scale: 1
            }}
            exit={getAnimationDirection()}
            transition={{
              duration: 0.2,
              ease: "easeOut"
            }}
            className={cn(
              "absolute z-50 px-3 py-2 text-sm font-medium rounded-lg pointer-events-none",
              "max-w-xs whitespace-normal break-words",
              styles.background,
              styles.border,
              styles.text,
              styles.shadow,
              styles.backdropBlur,
              getPositionClasses(),
              className
            )}
          >
            {/* Mystical particle effects for mystical variant */}
            {variant === "mystical" && (
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-jade-forest/60 rounded-full"
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.random() * 10 - 5, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    style={{
                      left: `${20 + i * 30}%`,
                      top: "80%",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Neural network effect for neural variant */}
            {variant === "neural" && (
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </div>
            )}

            {/* Sacred glow for sacred variant */}
            {variant === "sacred" && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(212, 175, 55, 0.3)",
                    "0 0 20px rgba(212, 175, 55, 0.5)",
                    "0 0 10px rgba(212, 175, 55, 0.3)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            )}

            {/* Content */}
            <div className="relative z-10">
              {content}
            </div>

            {/* Arrow */}
            <div 
              className={cn(
                "absolute w-0 h-0",
                getArrowClasses(),
                styles.arrowColor
              )} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Enhanced tooltip with custom animations
export function MysticalTooltip({
  children,
  content,
  ...props
}: Omit<AnimatedTooltipProps, 'variant'>) {
  return (
    <AnimatedTooltip variant="mystical" content={content} {...props}>
      {children}
    </AnimatedTooltip>
  );
}

export function NeuralTooltip({
  children,
  content,
  ...props
}: Omit<AnimatedTooltipProps, 'variant'>) {
  return (
    <AnimatedTooltip variant="neural" content={content} {...props}>
      {children}
    </AnimatedTooltip>
  );
}

export function SacredTooltip({
  children,
  content,
  ...props
}: Omit<AnimatedTooltipProps, 'variant'>) {
  return (
    <AnimatedTooltip variant="sacred" content={content} {...props}>
      {children}
    </AnimatedTooltip>
  );
}