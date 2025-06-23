# Harmonix AI Agent Platform

## Overview

Harmonix is a comprehensive AI infrastructure platform that enables businesses to Build, Automate, and Exit through intelligent automation. The platform features 12+ specialized AI agents (Digital Team Members), a token-based economy, multi-tenant architecture, gamified agent marketplace with NFT collectibles, and the SŌL brain orchestration engine. Our philosophy: "Help visionary businesses Build, Automate, and Exit" through strategic automation and AI-powered systems.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React Context for auth
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Build Tool**: Vite with custom configuration
- **Communication**: WebSocket integration for real-time updates

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints with real-time WebSocket support
- **Session Management**: JWT-based authentication
- **Development**: TSX for TypeScript execution

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Authentication System
- JWT-based authentication with refresh token support
- Multi-tenant organization model
- Role-based access control (user, admin, super_admin)
- Password hashing with bcrypt

### Agent Management (12+ Digital Team Members)
- **Flagship 6**: Sales, Concierge, HR, Social Media, Executive Assistant, Project Manager
- **Next-Wave**: Content Creation, Email Marketing, Finance, Legal/Compliance, Analyst/Forecasting, R&D/Innovation
- **Additional**: SOP Agent, Booking Agent, and specialized industry agents
- Gamified agent system with XP progression, collectible NFT skins, and marketplace
- Token-based usage tracking with auto-recharge system
- Agent-to-agent communication protocols via SŌL brain orchestration

### Real-time Communication
- WebSocket server for live updates
- Task status notifications
- Agent performance updates
- Organization-scoped message broadcasting

### Token Economy
- Organization-based token quotas and usage tracking
- User token balances
- Transaction history and analytics
- Purchase and consumption workflows

### Task Processing
- Asynchronous task execution with OpenAI integration
- Task status tracking (pending, in_progress, completed, failed)
- Token consumption tracking per task
- Output storage and retrieval

## Data Flow

1. **User Authentication**: JWT tokens manage user sessions with organization context
2. **Agent Deployment**: Users select from marketplace and deploy agents to their organization
3. **Task Creation**: Tasks are queued for processing by deployed agents
4. **AI Processing**: OpenAI integration processes tasks using agent-specific prompts
5. **Real-time Updates**: WebSocket broadcasts task status and completion notifications
6. **Token Management**: Token consumption is tracked and organization quotas are enforced

## External Dependencies

### Core Services
- **OpenAI API**: GPT-4o integration for AI agent processing
- **Neon Database**: Serverless PostgreSQL hosting
- **WebSocket**: Real-time bidirectional communication

### UI Components
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: SVG icon library
- **React Hook Form**: Form handling with validation

### Development Tools
- **Vite**: Fast build tool with HMR
- **ESBuild**: JavaScript bundler for production
- **TypeScript**: Type-safe development
- **Drizzle Kit**: Database schema management

## Deployment Strategy

### Development Environment
- Replit-optimized with cartographer plugin
- Vite dev server with WebSocket proxy
- Hot module replacement for rapid development
- Runtime error overlay integration

### Production Build
- Vite builds optimized client bundle
- ESBuild creates server bundle with external packages
- Static file serving from Express
- PostgreSQL connection pooling

### Environment Configuration
- DATABASE_URL for PostgreSQL connection
- OPENAI_API_KEY for AI processing
- JWT_SECRET for authentication security
- NODE_ENV for environment-specific behavior

## Service Offerings

### 1. AI Agents - Digital Team Members
- Base Installation: $12,500 per agent
- With SOP Mapping & Customization: $18,000
- Monthly Maintenance: $300-$1,000 (includes AI updates, prompt tuning, performance reports)

### 2. Web Design & Automation Services
- Landing Page (AI-optimized): $800
- Standard Website (3-9 pages): $4,400
- Custom Website: Custom Quote
- Monthly Maintenance: $200-$1,200

### 3. Blockchain & Fintech Services
- Base Project: $7,500+
- Custom Full-Stack Build: $15,000-$50,000
- Monthly Maintenance: $1,000-$2,500

### 4. The Launchpad (Incubator Program)
- Paid-in-Full: $15,000
- Financing: $18,000
- Includes: 90-day support, client acquisition system, training

### 5. The Boardroom (AI Advisory Council)
- Solo Advisor: $497/month
- Core Council: $1,200/month  
- Full Boardroom: $3,300+/month
- Enterprise Custom: Custom quote

## Changelog

- June 23, 2025: Initial platform setup with authentication and database
- June 23, 2025: Integrated comprehensive Harmonix documentation and service structure
- June 23, 2025: Enhanced backend with 12+ agent types and gamification system
- June 23, 2025: Implemented Agent CA$H as flagship sales agent with specialized prompts and dedicated interface
- June 23, 2025: Added NFT marketplace functionality with agent skins and collectibles
- June 23, 2025: Configured OpenAI API integration for full AI agent functionality
- June 23, 2025: Built complete CA$HFLOW agent with lead processing, CRM integration, and Loom script generation
- June 23, 2025: Added Agent Dashboard for real-time lead processing and performance monitoring
- June 23, 2025: Implemented NFT minting system with rarity tiers and blockchain integration framework
- June 23, 2025: Enhanced visual design with regal teal/gold palette and spiritual tech aesthetic
- June 23, 2025: Added interactive onboarding wizard with step-by-step platform introduction and tour functionality
- June 23, 2025: Implemented authentic Harmonix logo throughout platform with multiple variations and consistent branding
- June 23, 2025: Finalized authentic Harmonix logo component with correct circular H design using brand colors Deep Forest Emerald Green (#014321) and Royal Metallic Gold (#D1BFA7)
- June 23, 2025: Built complete public page architecture: /harmony, /join, /faq, /case-studies with proper navigation flow
- June 23, 2025: Updated brand messaging to "Intelligent Systems for Timeless Sovereignty" across all pages
- June 23, 2025: Implemented dynamic navigation that shows public links for visitors and private links for authenticated users
- June 23, 2025: Fixed all routing issues by registering missing pages in App.tsx router
- June 23, 2025: Created functional /login and /signup pages with proper authentication flow
- June 23, 2025: Built interactive /soul-brain demo page with AI chat simulation
- June 23, 2025: Fixed CSS font import warnings and resolved all navigation errors
- June 23, 2025: Implemented one-click demo deployment feature with pre-configured agent scenarios
- June 23, 2025: Created /demo-deploy page with 4 industry-specific scenarios (Sales, Startup, Enterprise, Consulting)
- June 23, 2025: Added realistic deployment simulation with progress tracking and agent status monitoring
- June 23, 2025: Updated homepage and navigation to prominently feature demo deployment option

## User Preferences

Preferred communication style: Simple, everyday language.