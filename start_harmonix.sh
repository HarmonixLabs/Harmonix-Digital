#!/bin/bash

# HARMONIX Platform Start Script
# Production-ready startup with health monitoring

echo "🌟 Starting HARMONIX AI Agent Platform..."
echo "========================================="

# Set production environment
export NODE_ENV=production

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[HARMONIX]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Pre-flight checks
print_status "Performing pre-flight checks..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    print_warning "Installing dependencies..."
    npm install
fi

# Check environment variables
if [ -z "$DATABASE_URL" ]; then
    print_warning "DATABASE_URL not set"
fi

if [ -z "$OPENAI_API_KEY" ]; then
    print_warning "OPENAI_API_KEY not set"
fi

print_success "Pre-flight checks completed"

# Start the platform
print_status "Launching HARMONIX Platform..."
print_status "Platform accessible at: http://localhost:5000"
print_status "Health endpoint: http://localhost:5000/health"

echo ""
echo "🚀 HARMONIX Features Active:"
echo "   • 12+ AI Agents (CA$H, GRACE, ASTER, IRIS, HELIOS, ATLAS...)"
echo "   • SŌL Brain Orchestration Engine"
echo "   • Agent Marketplace with NFT System"
echo "   • Stripe Payment Processing"
echo "   • Go High Level CRM Integration"
echo "   • Sacred Design System"
echo "   • Real-time WebSocket Communication"
echo ""

# Start the application
npm run dev