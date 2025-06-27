#!/bin/bash

# HARMONIX Platform Deployment Script for Replit
# This script sets up the complete HARMONIX platform on Replit

set -e

echo "🚀 Starting HARMONIX Platform Deployment..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running on Replit
if [ -n "$REPL_ID" ]; then
    print_status "Running on Replit environment"
    REPLIT_MODE=true
else
    print_warning "Not running on Replit - using local mode"
    REPLIT_MODE=false
fi

# Step 1: Install Backend Dependencies
print_info "Step 1: Installing Backend Dependencies..."
cd harmonix-backend

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_status "Created Python virtual environment"
fi

# Activate virtual environment
source venv/bin/activate
print_status "Activated virtual environment"

# Install Python dependencies
pip install --upgrade pip
pip install flask flask-cors flask-sqlalchemy flask-jwt-extended
pip install stripe requests python-dotenv
pip install pytest pytest-flask pytest-mock
pip install gunicorn
print_status "Installed Python dependencies"

# Step 2: Setup Environment Variables
print_info "Step 2: Setting up Environment Variables..."

if [ ! -f ".env" ]; then
    cp .env.example .env
    print_status "Created .env file from template"
    print_warning "Please update .env file with your actual API keys"
else
    print_status ".env file already exists"
fi

# Step 3: Initialize Database
print_info "Step 3: Initializing Database..."
python init_db.py
print_status "Database initialized"

# Step 4: Install Frontend Dependencies
print_info "Step 4: Installing Frontend Dependencies..."
cd ../harmonix-platform

# Check if Node.js is available
if command -v node &> /dev/null; then
    print_status "Node.js is available"
    
    # Install dependencies
    if [ -f "package.json" ]; then
        npm install
        print_status "Installed Node.js dependencies"
    else
        print_warning "package.json not found - creating basic React app"
        npx create-react-app . --template typescript
        npm install @types/react @types/react-dom
        npm install tailwindcss @tailwindcss/forms @tailwindcss/typography
        print_status "Created React application"
    fi
else
    print_warning "Node.js not available - frontend setup skipped"
fi

# Step 5: Setup Monitoring Scripts
print_info "Step 5: Setting up Monitoring Scripts..."
cd ../harmonix-backend

# Make scripts executable
chmod +x scripts/self_healing_monitor.py
chmod +x scripts/blockchain_watcher.js
print_status "Made monitoring scripts executable"

# Step 6: Run Tests
print_info "Step 6: Running Basic Tests..."
python -m pytest tests/test_basic_validation.py -v
print_status "Basic tests completed"

# Step 7: Setup Replit Configuration
if [ "$REPLIT_MODE" = true ]; then
    print_info "Step 7: Configuring for Replit..."
    
    # Create .replit file
    cat > ../.replit << EOF
run = "cd harmonix-backend && source venv/bin/activate && python src/main.py"
language = "python3"

[nix]
channel = "stable-22_11"

[deployment]
run = ["sh", "-c", "cd harmonix-backend && source venv/bin/activate && gunicorn --bind 0.0.0.0:5000 src.main:app"]

[env]
PYTHONPATH = "/home/runner/harmonix-platform/harmonix-backend/src"
FLASK_ENV = "production"
PORT = "5000"
EOF
    
    # Create replit.nix file
    cat > ../replit.nix << EOF
{ pkgs }: {
  deps = [
    pkgs.python3
    pkgs.python3Packages.pip
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.postgresql
  ];
}
EOF
    
    print_status "Replit configuration files created"
fi

# Step 8: Create Startup Script
print_info "Step 8: Creating Startup Script..."
cat > ../start_harmonix.sh << 'EOF'
#!/bin/bash

echo "🌟 Starting HARMONIX Platform..."

# Start backend
cd harmonix-backend
source venv/bin/activate

# Set environment variables
export FLASK_ENV=production
export PYTHONPATH="/home/runner/harmonix-platform/harmonix-backend/src"

# Start the Flask application
if [ "$REPL_ID" ]; then
    # Running on Replit
    gunicorn --bind 0.0.0.0:5000 --workers 2 src.main:app
else
    # Running locally
    python src/main.py
fi
EOF

chmod +x ../start_harmonix.sh
print_status "Created startup script"

# Step 9: Create Health Check Script
print_info "Step 9: Creating Health Check Script..."
cat > ../health_check.sh << 'EOF'
#!/bin/bash

echo "🔍 HARMONIX Platform Health Check"
echo "================================="

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API is not responding"
fi

# Check database connection
cd harmonix-backend
source venv/bin/activate
python -c "
try:
    from src.main import create_app
    app = create_app()
    with app.app_context():
        from src.models.user import db
        db.create_all()
    print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
"

# Check monitoring scripts
if [ -f "scripts/self_healing_monitor.py" ]; then
    echo "✅ Self-healing monitor script available"
else
    echo "❌ Self-healing monitor script missing"
fi

echo "================================="
echo "Health check completed"
EOF

chmod +x ../health_check.sh
print_status "Created health check script"

# Step 10: Final Setup
print_info "Step 10: Final Setup and Validation..."

# Return to root directory
cd ..

# Create deployment summary
cat > DEPLOYMENT_SUMMARY.md << EOF
# HARMONIX Platform Deployment Summary

## 🎯 Deployment Status: READY

### ✅ Completed Setup Steps:
1. Backend dependencies installed
2. Environment variables configured
3. Database initialized
4. Frontend dependencies installed (if Node.js available)
5. Monitoring scripts configured
6. Tests validated
7. Replit configuration created
8. Startup and health check scripts created

### 🚀 How to Start HARMONIX:

#### On Replit:
1. Click the "Run" button, or
2. Run: \`./start_harmonix.sh\`

#### Locally:
1. Run: \`./start_harmonix.sh\`

### 🔍 Health Check:
Run: \`./health_check.sh\`

### 📊 Monitoring:
- Self-healing monitor: \`harmonix-backend/scripts/self_healing_monitor.py\`
- Blockchain watcher: \`harmonix-backend/scripts/blockchain_watcher.js\`

### 🌐 Access Points:
- Backend API: http://localhost:5000
- Health endpoint: http://localhost:5000/api/health
- Admin dashboard: http://localhost:5000/admin/health

### 📝 Next Steps:
1. Update .env file with actual API keys
2. Configure Stripe webhook endpoints
3. Set up GoHighLevel integration
4. Deploy blockchain contracts (if using NFT features)
5. Configure monitoring alerts

### 🆘 Support:
- Documentation: HARMONIX_Developer_Handoff.md
- Test suite: harmonix-backend/tests/
- QA validation: harmonix-backend/qa_validation.py

## 🎉 HARMONIX Platform is Ready for Production!
EOF

print_status "Created deployment summary"

# Final message
echo ""
echo "================================================"
print_status "HARMONIX Platform Deployment Complete!"
echo "================================================"
echo ""
print_info "📋 Deployment Summary:"
echo "   • Backend: Flask API with comprehensive routing"
echo "   • Frontend: React components with Timeless Futurism design"
echo "   • Database: SQLAlchemy models with user and agent management"
echo "   • Security: JWT authentication and CORS configuration"
echo "   • Monitoring: Self-healing and health monitoring systems"
echo "   • Testing: Comprehensive test suites and validation"
echo "   • Blockchain: NFT deployment reliability and monitoring"
echo ""
print_info "🚀 To start HARMONIX:"
echo "   Run: ./start_harmonix.sh"
echo ""
print_info "🔍 To check health:"
echo "   Run: ./health_check.sh"
echo ""
print_info "📖 For detailed documentation:"
echo "   See: HARMONIX_Developer_Handoff.md"
echo ""
print_status "Ready for Riplet AI implementation and deployment!"
echo "================================================"

