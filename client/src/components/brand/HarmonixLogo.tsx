import { cn } from "@/lib/utils";

// Official Harmonix logo variations using authentic brand assets
import logoFullDark from "@assets/D7443A53-8E43-4909-A53F-91226DAE5CA5_1750667238147.png";
import logoIconGold from "@assets/F72A7C4A-0C41-4830-BD53-ED08B8DD3B41_1750667238148.png";
import logoIconGreen from "@assets/58074907-A735-4BED-8CB3-0A68C2FEA048_1750667324877.png";
import logoHGold from "@assets/BFC45F42-7E70-42F6-AF76-D2208332532E_1750667238148.png";
import logoScenic from "@assets/E57FFF20-46EB-4292-AD77-AA00E8CFB1F2_1750667349337.png";
// New monogram designs
import monogramForest from "@assets/E57FFF20-46EB-4292-AD77-AA00E8CFB1F2_1751013871890.png";
import monogramDark from "@assets/6A3F9992-A385-4A3D-BB53-5D44C730E829_1751013871890.png";

interface HarmonixLogoProps {
  variant?: "full" | "icon" | "h-mark" | "scenic" | "monogram" | "monogram-dark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function HarmonixLogo({ 
  variant = "full", 
  size = "md", 
  className 
}: HarmonixLogoProps) {
  // Responsive size classes with mobile-first approach
  const sizeClasses = {
    sm: "h-6 sm:h-6 md:h-8 lg:h-8",      // 24px → 32px
    md: "h-8 sm:h-10 md:h-12 lg:h-12",   // 32px → 48px  
    lg: "h-10 sm:h-12 md:h-14 lg:h-16",  // 40px → 64px
    xl: "h-12 sm:h-14 md:h-16 lg:h-20"   // 48px → 80px
  };

  const getLogoSrc = () => {
    switch (variant) {
      case "full":
        return logoFullDark;
      case "icon":
        return logoIconGreen;
      case "h-mark":
        return logoHGold;
      case "scenic":
        return logoScenic;
      case "monogram":
        return monogramForest;
      case "monogram-dark":
        return monogramDark;
      default:
        return logoFullDark;
    }
  };

  // Get image source
  const logoSrc = getLogoSrc();
  
  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source 
        type="image/webp" 
        srcSet={`${logoSrc} 1x, ${logoSrc} 2x, ${logoSrc} 3x`}
      />
      {/* PNG fallback with retina support */}
      <img
        src={logoSrc}
        srcSet={`${logoSrc} 1x, ${logoSrc} 2x, ${logoSrc} 3x`}
        alt="Harmonix Digital"
        className={cn(sizeClasses[size], "object-contain", className)}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

// Brand colors from official palette
export const harmonixColors = {
  deepForestBlack: "#0b0f0e",
  cedarGreenMist: "#2f4e46", 
  sageFade: "#768b7c",
  regalGold: "#d7b76d",
  nightPineShadow: "#111f1a"
};