import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
}

const gapClasses = {
  xs: "gap-2",    // 8px (1 * 8px)
  sm: "gap-4",    // 16px (2 * 8px)
  md: "gap-6",    // 24px (3 * 8px)
  lg: "gap-8",    // 32px (4 * 8px)
  xl: "gap-12"    // 48px (6 * 8px)
};

export function Grid({ 
  children, 
  className,
  cols = { mobile: 1, sm: 2, md: 3, lg: 4 },
  gap = "md"
}: GridProps) {
  const gridClasses = cn(
    "grid",
    `grid-cols-${cols.mobile || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    gapClasses[gap],
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}