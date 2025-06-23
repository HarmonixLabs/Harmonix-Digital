import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  glowEffect?: boolean;
  pulseEffect?: boolean;
}

export const AnimatedButton = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  type = "button",
  glowEffect = true,
  pulseEffect = false
}: AnimatedButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={`
          relative overflow-hidden group
          ${glowEffect && !disabled ? 'hover:shadow-lg hover:shadow-[#d7b76d]/30' : ''}
          ${pulseEffect ? 'animate-pulse' : ''}
          transition-all duration-300
          ${className}
        `}
      >
        {glowEffect && !disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
};