# Harmonix AI Agent Platform

## Overview

Harmonix is a full-stack AI agent platform that enables organizations to deploy, manage, and monetize AI agents across various business functions. The platform features a multi-tenant architecture with token-based economy, real-time communication, and a comprehensive agent marketplace.

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

### Agent Management
- Predefined agent types with categories (sales, hr, concierge, executive, sop, booking)
- Customizable agent deployments per organization
- Token-based usage tracking and billing
- Performance analytics and monitoring

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

## Changelog

Changelog:
- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.