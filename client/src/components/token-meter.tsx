interface TokenMeterProps {
  used: number;
  total: number;
  size?: "sm" | "md" | "lg";
}

export function TokenMeter({ used, total, size = "md" }: TokenMeterProps) {
  const percentage = (used / total) * 100;
  const remaining = total - used;
  
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32", 
    lg: "w-40 h-40"
  };

  const textSizes = {
    sm: { percentage: "text-lg", label: "text-xs" },
    md: { percentage: "text-2xl", label: "text-sm" },
    lg: { percentage: "text-3xl", label: "text-base" }
  };

  // Calculate stroke-dashoffset for the progress circle
  const circumference = 2 * Math.PI * 50; // radius = 50
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle 
          cx="60" 
          cy="60" 
          r="50" 
          stroke="hsl(213, 27%, 15%)" 
          strokeWidth="8" 
          fill="none"
        />
        {/* Progress circle */}
        <circle 
          cx="60" 
          cy="60" 
          r="50" 
          stroke="hsl(188, 60%, 58%)" 
          strokeWidth="8" 
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`font-bold harmony-teal ${textSizes[size].percentage}`}>
            {Math.round((remaining / total) * 100)}%
          </div>
          <div className={`text-gray-400 ${textSizes[size].label}`}>
            remaining
          </div>
        </div>
      </div>
    </div>
  );
}
