import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Design Brief 8px Grid System Implementation
      spacing: {
        'xs': '4px',     // 0.25rem - Brief: tight spacing within components
        'sm': '8px',     // 0.5rem  - Brief: small gaps between related elements
        'md': '16px',    // 1rem    - Brief: default gutter (standard spacing)
        'lg': '24px',    // 1.5rem  - Brief: larger gaps between sections
        'xl': '32px',    // 2rem    - Brief: major section spacing
        '2xl': '48px',   // 3rem    - Brief: large section breaks
        '3xl': '64px',   // 4rem    - Brief: page-level spacing
        '4xl': '96px',   // 6rem    - Brief: hero section spacing
      },
      
      // Design Brief Typography Scale
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', fontWeight: '700' }],  // Brief: Hero headlines
        'display-md': ['40px', { lineHeight: '48px', fontWeight: '700' }],  // Brief: Section headers
        'display-sm': ['32px', { lineHeight: '40px', fontWeight: '700' }],  // Brief: Page titles
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],     // Brief: Important body text
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],     // Brief: Standard body text
      },
      
      // Design Brief Container Max-Width System
      maxWidth: {
        'card': '320px',      // Brief: Card max-width requirement
        'form': '480px',      // Brief: Form max-width requirement
        'content': '1280px',  // Brief: Container width
      },
      
      // Design Brief Custom Grid Configuration
      gridTemplateColumns: {
        'mobile': 'repeat(4, 1fr)',     // Brief: Mobile 4-column
        'tablet': 'repeat(8, 1fr)',     // Brief: Tablet 8-column
        'desktop': 'repeat(12, 1fr)',   // Brief: Desktop 12-column
      },
      
      // Design Brief Responsive Breakpoints
      screens: {
        'mobile': { 'max': '767px' },      // Brief: 320-767px
        'tablet': { 'min': '768px', 'max': '1199px' }, // Brief: 768-1199px
        'desktop': { 'min': '1200px' },    // Brief: 1200px+
      },
      
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
        // System colors (keep existing)
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
        
        // HARMONIX Core Brand Palette - Unified System
        "harmonix-deep-forest": "var(--harmonix-deep-forest)",
        "harmonix-cedar-mist": "var(--harmonix-cedar-mist)",
        "harmonix-sage-fade": "var(--harmonix-sage-fade)",
        "harmonix-regal-gold": "var(--harmonix-regal-gold)",
        "harmonix-night-pine": "var(--harmonix-night-pine)",
        "harmonix-emerald-deep": "var(--harmonix-emerald-deep)",
        "harmonix-gold-bright": "var(--harmonix-gold-bright)",
        "harmonix-ivory-light": "var(--harmonix-ivory-light)",
        
        // Legacy Support (redirects to harmonix)
        "jade-forest": "var(--jade-forest)",
        "golden-sovereign": "var(--golden-sovereign)", 
        "ivory-light": "var(--ivory-light)",
        "charcoal-deep": "var(--charcoal-deep)",
        "slate-gray": "#2F2F2F",
        "ember-glow": "var(--ember-glow)",
        "reactor-red": "#E63946",
        
        // Functional colors (derived from harmonix)
        "jade-forest-muted": "var(--jade-forest-muted)",
        "jade-forest-dark": "var(--jade-forest-dark)",
        "golden-muted": "#F4E4A1",
        "golden-dark": "var(--golden-dark)",
        
        // Semantic Colors
        "success-green": "#22c55e",
        "warning-amber": "#f59e0b", 
        "error-red": "#ef4444",
        "info-blue": "#3b82f6",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
