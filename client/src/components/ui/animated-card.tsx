import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverScale?: number;
  glowEffect?: boolean;
}

export const AnimatedCard = ({ 
  children, 
  className = "", 
  delay = 0, 
  hoverScale = 1.02,
  glowEffect = true 
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: hoverScale,
        y: -5,
        transition: { duration: 0.2, ease: "easeInOut" }
      }}
      className={className}
    >
      <Card 
        className={`
          relative overflow-hidden border-harmonix-sage/20 
          ${glowEffect ? 'hover:shadow-lg hover:shadow-[#d7b76d]/20' : ''}
          transition-all duration-300
        `}
      >
        {glowEffect && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d7b76d]/5 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
        {children}
      </Card>
    </motion.div>
  );
};