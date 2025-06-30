import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const harmonixButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harmonix-regal-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        "harmonix-primary": "bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-gold-bright hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300",
        "harmonix-outline": "border-2 border-harmonix-regal-gold text-harmonix-regal-gold bg-transparent hover:bg-harmonix-regal-gold hover:text-harmonix-deep-forest transition-all duration-300",
        "harmonix-ghost": "text-harmonix-sage-fade hover:text-harmonix-regal-gold hover:bg-harmonix-cedar-mist/20 transition-all duration-300",
        "harmonix-secondary": "bg-harmonix-cedar-mist text-harmonix-ivory-light hover:bg-harmonix-sage-fade transition-all duration-300",
        "harmonix-glow": "bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-gold-bright hover:shadow-2xl hover:shadow-harmonix-regal-gold/30 hover:-translate-y-1 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "harmonix-primary",
      size: "default",
    },
  }
)

export interface HarmonixButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof harmonixButtonVariants> {
  asChild?: boolean
}

const HarmonixButton = React.forwardRef<HTMLButtonElement, HarmonixButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(harmonixButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
HarmonixButton.displayName = "HarmonixButton"

export { HarmonixButton, harmonixButtonVariants }