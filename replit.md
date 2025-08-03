# Harmonix AI Agent Platform

## Overview

HARMONIX is a sophisticated AI agent orchestration platform designed for businesses to deploy, manage, and scale multiple AI agents from a unified command center. It embodies a "Timeless Futurism" design philosophy with a forest green and gold aesthetic, symbolizing wisdom, sovereignty, and premium quality. The core philosophy is "Intelligent Systems for Timeless Sovereignty," combining cutting-edge AI technology with elegant, intuitive user experiences.

The platform offers an Agent Marketplace with 12 specialized AI agents, a drag-and-drop agent builder, a real-time dashboard with performance analytics, and NFT integration for blockchain agent ownership. Key capabilities include a 7-day trial system, GoHighLevel CRM integration, Stripe payment processing with subscription management, magic-link demo authentication, and self-healing monitoring. It supports six elite AI agents (CA$H, GRACE, ECHO, FLOW, KAIROS, SŌL) with live integrations and features a four-tier pricing model for immediate monetization, including enhanced deposit logic and a package deposit system. A viral referral system is also implemented to drive user acquisition.

## User Preferences

Preferred communication style: Simple, everyday language.

**Brand Messaging Guidelines:**
- Core slogans should only be used strategically where they fit naturally, sell effectively, and enhance platform appeal
- Avoid overusing slogans across every page - quality over quantity placement
- Focus on natural integration that enhances user experience rather than forced messaging

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React Context for authentication
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Build Tool**: Vite with custom configuration
- **Communication**: WebSocket integration for real-time updates
- **Design Philosophy**: "Timeless Futurism" with a forest green and gold aesthetic, featuring sacred design components (e.g., SacredButton, SacredCard, SacredLoader) and micro-animations. Emphasis on 8px grid system, 320px card max-width, and 48px touch targets for WCAG AA compliance.

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints with real-time WebSocket support
- **Authentication**: JWT-based authentication with refresh token support and role-based access control (user, admin, super_admin)
- **Development**: TSX for TypeScript execution

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for database migrations

### Key Components
- **Agent Management**: Orchestrates 12+ digital team members (e.g., Sales, HR, Social Media) with gamified XP progression, collectible NFT skins, and token-based usage tracking. Features SŌL brain for agent-to-agent communication.
- **Real-time Communication**: WebSocket server for live updates on task status, agent performance, and organization-scoped messages.
- **Token Economy**: Manages organization-based token quotas, user balances, and transaction history.
- **Task Processing**: Asynchronous task execution with OpenAI integration, tracking status and token consumption.
- **Dashboard System**: Features a comprehensive dashboard architecture with 6 integrated hubs (MyAgentsHub, PipelinesHub, ContentCenter, SolBrainCenter) and 4 distinct role-based user experiences (Founder, Team Member, Agent Creator, Viewer).
- **Interactive Features**: Includes AI Character Loading Skeletons, Animated Form Validation, Personalized Dashboard Widgets, a 7-Theme Switcher System, and an AI Guide Tooltip System.
- **Self-Healing Protocol**: Continuously monitors and auto-remediates platform issues, covering routing, layout, typography, brand, animations, forms, accessibility, and overall health.

## External Dependencies

- **OpenAI API**: For AI agent processing (GPT-4o integration).
- **Neon Database**: Serverless PostgreSQL hosting.
- **Stripe**: Payment processing, subscription management, and automatic tax calculation.
- **GoHighLevel (GHL) CRM**: CRM integration, including opportunity creation, affiliate tracking, lead capture, and bidirectional sync via webhooks.
- **Pipedream**: For live workflow execution and agent integration.
- **WebSocket**: For real-time bidirectional communication.
- **Radix UI**: Headless component primitives for UI.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide Icons**: SVG icon library.
- **React Hook Form**: Form handling with validation.
- **Google Sheets API**: For comprehensive form handling and data collection.
- **HubSpot**: Secondary CRM integration for lead capture (used in multi-CRM system).