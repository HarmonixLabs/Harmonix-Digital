import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  centered?: boolean;
}

const sizeClasses = {
  sm: "max-w-3xl", // 768px
  md: "max-w-5xl", // 1024px  
  lg: "max-w-6xl", // 1152px
  xl: "max-w-7xl", // 1280px
  full: "max-w-full"
};

export function Container({ 
  children, 
  className,
  size = "xl",
  centered = true
}: ContainerProps) {
  return (
    <div className={cn(
      "w-full",
      "px-4 sm:px-6 lg:px-8", // Responsive padding following 8px grid
      sizeClasses[size],
      centered && "mx-auto",
      className
    )}>
      {children}
    </div>
  );
}