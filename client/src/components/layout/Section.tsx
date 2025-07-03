import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "transparent" | "muted" | "dark" | "gradient";
}

const spacingClasses = {
  none: "",
  sm: "py-8",    // 32px (4 * 8px)
  md: "py-16",   // 64px (8 * 8px)
  lg: "py-24",   // 96px (12 * 8px)
  xl: "py-32"    // 128px (16 * 8px)
};

const backgroundClasses = {
  transparent: "",
  muted: "bg-harmonix-sage-fade/5",
  dark: "bg-harmonix-deep-forest",
  gradient: "bg-gradient-to-b from-harmonix-deep-forest to-harmonix-night-pine"
};

export function Section({ 
  children, 
  className,
  spacing = "md",
  background = "transparent"
}: SectionProps) {
  return (
    <section className={cn(
      "w-full",
      spacingClasses[spacing],
      backgroundClasses[background],
      className
    )}>
      {children}
    </section>
  );
}