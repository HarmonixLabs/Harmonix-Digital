import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' }
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        ripple: 'ripple 0.6s ease-out',
        fadeInUp: 'fadeInUp 0.6s ease-out',
        slideInRight: 'slideInRight 0.5s ease-out',
        breathe: 'breathe 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite'
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // HARMONIX Timeless Futurism Brand Palette
        "jade-forest": "#0d4f3c",
        "golden-authority": "#d4af37", 
        "deep-charcoal": "#1a1a1a",
        "soft-jade": "#4a9b8e",
        "champagne-gold": "#f4e4bc",
        "warm-white": "#fafafa",
        "medium-gray": "#6b7280",
        
        // Semantic Colors
        "success-green": "#22c55e",
        "warning-amber": "#f59e0b", 
        "error-red": "#ef4444",
        "info-blue": "#3b82f6",
        
        // Legacy Colors
        "harmony-dark": "hsl(210, 24%, 8%)",
        "harmony-slate": "hsl(213, 27%, 15%)", 
        "harmony-gold": "hsl(47, 84%, 52%)",
        "harmony-teal": "hsl(188, 60%, 58%)",
        "harmony-blue": "hsl(210, 100%, 56%)",
        "harmonix-deep-forest": "#0b0f0e",
        "harmonix-cedar-mist": "#2f4e46", 
        "harmonix-sage-fade": "#768b7c",
        "harmonix-regal-gold": "#d7b76d",
        "harmonix-night-pine": "#111f1a",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
