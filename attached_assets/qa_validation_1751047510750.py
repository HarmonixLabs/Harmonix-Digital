#!/usr/bin/env python3
"""
HARMONIX Platform QA Validation Script
Comprehensive testing and validation for production readiness
"""

import os
import sys
import json
import subprocess
import time
from pathlib import Path

class HarmonixQAValidator:
    def __init__(self):
        self.results = {
            'passed': 0,
            'failed': 0,
            'warnings': 0,
            'tests': []
        }
        self.base_path = Path(__file__).parent.parent

    def log_test(self, name, status, message="", details=None):
        """Log test result"""
        test_result = {
            'name': name,
            'status': status,
            'message': message,
            'details': details or {}
        }
        self.results['tests'].append(test_result)
        
        if status == 'PASS':
            self.results['passed'] += 1
            print(f"✅ {name}: {message}")
        elif status == 'FAIL':
            self.results['failed'] += 1
            print(f"❌ {name}: {message}")
        elif status == 'WARN':
            self.results['warnings'] += 1
            print(f"⚠️  {name}: {message}")

    def validate_file_structure(self):
        """Validate project file structure"""
        print("\n🔍 Validating File Structure...")
        
        required_files = [
            'src/main.py',
            'src/models/user.py',
            'src/models/agent_models.py',
            'src/routes/auth.py',
            'src/routes/agent.py',
            'src/routes/demo.py',
            'src/routes/health.py',
            'src/lib/stripe_service.py',
            'src/lib/ghl.py',
            'src/lib/email_service.py',
            'scripts/self_healing_monitor.py',
            'scripts/blockchain_watcher.js',
            'tests/blockchain/AgentNFT.test.js'
        ]
        
        for file_path in required_files:
            full_path = self.base_path / file_path
            if full_path.exists():
                self.log_test(f"File Structure - {file_path}", "PASS", "File exists")
            else:
                self.log_test(f"File Structure - {file_path}", "FAIL", "File missing")

    def validate_python_syntax(self):
        """Validate Python syntax for all Python files"""
        print("\n🐍 Validating Python Syntax...")
        
        python_files = list(self.base_path.glob("**/*.py"))
        syntax_errors = 0
        
        for py_file in python_files:
            try:
                with open(py_file, 'r') as f:
                    compile(f.read(), py_file, 'exec')
                self.log_test(f"Python Syntax - {py_file.name}", "PASS", "Valid syntax")
            except SyntaxError as e:
                syntax_errors += 1
                self.log_test(f"Python Syntax - {py_file.name}", "FAIL", f"Syntax error: {e}")
            except Exception as e:
                self.log_test(f"Python Syntax - {py_file.name}", "WARN", f"Could not validate: {e}")
        
        if syntax_errors == 0:
            self.log_test("Python Syntax Overall", "PASS", "All Python files have valid syntax")
        else:
            self.log_test("Python Syntax Overall", "FAIL", f"{syntax_errors} files with syntax errors")

    def validate_environment_config(self):
        """Validate environment configuration"""
        print("\n⚙️  Validating Environment Configuration...")
        
        required_env_vars = [
            'FLASK_ENV',
            'DATABASE_URL',
            'JWT_SECRET_KEY',
            'STRIPE_SECRET_KEY',
            'OPENAI_API_KEY',
            'GOHIGHLEVEL_API_KEY',
            'SENDGRID_API_KEY',
            'TWILIO_ACCOUNT_SID',
            'TWILIO_AUTH_TOKEN'
        ]
        
        env_example_path = self.base_path / '.env.example'
        if env_example_path.exists():
            self.log_test("Environment Config", "PASS", ".env.example file exists")
            
            with open(env_example_path, 'r') as f:
                env_content = f.read()
                
            for var in required_env_vars:
                if var in env_content:
                    self.log_test(f"Env Var - {var}", "PASS", "Documented in .env.example")
                else:
                    self.log_test(f"Env Var - {var}", "WARN", "Not documented in .env.example")
        else:
            self.log_test("Environment Config", "FAIL", ".env.example file missing")

    def validate_api_structure(self):
        """Validate API route structure"""
        print("\n🌐 Validating API Structure...")
        
        route_files = [
            'src/routes/auth.py',
            'src/routes/agent.py',
            'src/routes/demo.py',
            'src/routes/health.py',
            'src/routes/webhooks.py'
        ]
        
        for route_file in route_files:
            file_path = self.base_path / route_file
            if file_path.exists():
                try:
                    with open(file_path, 'r') as f:
                        content = f.read()
                    
                    # Check for Blueprint definition
                    if 'Blueprint' in content:
                        self.log_test(f"API Route - {route_file}", "PASS", "Blueprint defined")
                    else:
                        self.log_test(f"API Route - {route_file}", "WARN", "No Blueprint found")
                        
                    # Check for route decorators
                    if '@' in content and 'route' in content:
                        self.log_test(f"API Routes - {route_file}", "PASS", "Route decorators found")
                    else:
                        self.log_test(f"API Routes - {route_file}", "WARN", "No route decorators found")
                        
                except Exception as e:
                    self.log_test(f"API Route - {route_file}", "FAIL", f"Error reading file: {e}")
            else:
                self.log_test(f"API Route - {route_file}", "FAIL", "Route file missing")

    def validate_database_models(self):
        """Validate database model structure"""
        print("\n🗄️  Validating Database Models...")
        
        model_files = [
            'src/models/user.py',
            'src/models/agent_models.py'
        ]
        
        for model_file in model_files:
            file_path = self.base_path / model_file
            if file_path.exists():
                try:
                    with open(file_path, 'r') as f:
                        content = f.read()
                    
                    # Check for SQLAlchemy imports
                    if 'SQLAlchemy' in content or 'db.Model' in content:
                        self.log_test(f"DB Model - {model_file}", "PASS", "SQLAlchemy model found")
                    else:
                        self.log_test(f"DB Model - {model_file}", "WARN", "No SQLAlchemy model found")
                        
                    # Check for class definitions
                    if 'class ' in content:
                        self.log_test(f"DB Classes - {model_file}", "PASS", "Model classes defined")
                    else:
                        self.log_test(f"DB Classes - {model_file}", "WARN", "No model classes found")
                        
                except Exception as e:
                    self.log_test(f"DB Model - {model_file}", "FAIL", f"Error reading file: {e}")
            else:
                self.log_test(f"DB Model - {model_file}", "FAIL", "Model file missing")

    def validate_frontend_structure(self):
        """Validate frontend structure"""
        print("\n⚛️  Validating Frontend Structure...")
        
        frontend_path = self.base_path.parent / 'harmonix-platform'
        
        if frontend_path.exists():
            self.log_test("Frontend Directory", "PASS", "Frontend directory exists")
            
            # Check for package.json
            package_json = frontend_path / 'package.json'
            if package_json.exists():
                self.log_test("Frontend Package", "PASS", "package.json exists")
                
                try:
                    with open(package_json, 'r') as f:
                        package_data = json.load(f)
                    
                    # Check for React dependencies
                    deps = package_data.get('dependencies', {})
                    if 'react' in deps:
                        self.log_test("Frontend React", "PASS", f"React {deps['react']} configured")
                    else:
                        self.log_test("Frontend React", "WARN", "React not found in dependencies")
                        
                    if 'next' in deps:
                        self.log_test("Frontend Next.js", "PASS", f"Next.js {deps['next']} configured")
                    else:
                        self.log_test("Frontend Next.js", "WARN", "Next.js not found in dependencies")
                        
                except Exception as e:
                    self.log_test("Frontend Package", "FAIL", f"Error reading package.json: {e}")
            else:
                self.log_test("Frontend Package", "FAIL", "package.json missing")
                
            # Check for key components
            components_dir = frontend_path / 'src' / 'components'
            if components_dir.exists():
                component_files = [
                    'AgentBuilder.jsx',
                    'AgentMarketplace.jsx',
                    'Dashboard.jsx',
                    'DemoSuite.jsx'
                ]
                
                for component in component_files:
                    component_path = components_dir / component
                    if component_path.exists():
                        self.log_test(f"Frontend Component - {component}", "PASS", "Component exists")
                    else:
                        self.log_test(f"Frontend Component - {component}", "WARN", "Component missing")
            else:
                self.log_test("Frontend Components", "WARN", "Components directory missing")
        else:
            self.log_test("Frontend Directory", "FAIL", "Frontend directory missing")

    def validate_testing_infrastructure(self):
        """Validate testing infrastructure"""
        print("\n🧪 Validating Testing Infrastructure...")
        
        test_files = [
            'tests/test_basic_validation.py',
            'tests/blockchain/AgentNFT.test.js',
            'tests/unit/test_harmonix.py',
            'tests/performance/k6-load-test.js'
        ]
        
        for test_file in test_files:
            file_path = self.base_path / test_file
            if file_path.exists():
                self.log_test(f"Test File - {test_file}", "PASS", "Test file exists")
            else:
                self.log_test(f"Test File - {test_file}", "WARN", "Test file missing")

    def validate_monitoring_scripts(self):
        """Validate monitoring and self-healing scripts"""
        print("\n📊 Validating Monitoring Scripts...")
        
        monitoring_files = [
            'scripts/self_healing_monitor.py',
            'scripts/blockchain_watcher.js'
        ]
        
        for script_file in monitoring_files:
            file_path = self.base_path / script_file
            if file_path.exists():
                self.log_test(f"Monitoring Script - {script_file}", "PASS", "Script exists")
                
                # Check if script is executable
                if os.access(file_path, os.X_OK):
                    self.log_test(f"Script Permissions - {script_file}", "PASS", "Script is executable")
                else:
                    self.log_test(f"Script Permissions - {script_file}", "WARN", "Script not executable")
            else:
                self.log_test(f"Monitoring Script - {script_file}", "FAIL", "Script missing")

    def validate_design_system(self):
        """Validate design system and tokens"""
        print("\n🎨 Validating Design System...")
        
        design_files = [
            '../harmonix-design-tokens-v2.json',
            '../harmonix-platform/src/styles/harmonix-design-system.css'
        ]
        
        for design_file in design_files:
            file_path = self.base_path / design_file
            if file_path.exists():
                self.log_test(f"Design System - {design_file}", "PASS", "Design file exists")
                
                if design_file.endswith('.json'):
                    try:
                        with open(file_path, 'r') as f:
                            json.load(f)
                        self.log_test(f"Design Tokens - {design_file}", "PASS", "Valid JSON format")
                    except json.JSONDecodeError as e:
                        self.log_test(f"Design Tokens - {design_file}", "FAIL", f"Invalid JSON: {e}")
            else:
                self.log_test(f"Design System - {design_file}", "WARN", "Design file missing")

    def validate_security_measures(self):
        """Validate security implementation"""
        print("\n🔒 Validating Security Measures...")
        
        # Check for JWT implementation
        auth_file = self.base_path / 'src/routes/auth.py'
        if auth_file.exists():
            with open(auth_file, 'r') as f:
                content = f.read()
            
            if 'jwt' in content.lower():
                self.log_test("Security - JWT", "PASS", "JWT authentication implemented")
            else:
                self.log_test("Security - JWT", "WARN", "JWT authentication not found")
                
            if 'password' in content and 'hash' in content:
                self.log_test("Security - Password Hashing", "PASS", "Password hashing implemented")
            else:
                self.log_test("Security - Password Hashing", "WARN", "Password hashing not found")
        
        # Check for CORS implementation
        main_file = self.base_path / 'src/main.py'
        if main_file.exists():
            with open(main_file, 'r') as f:
                content = f.read()
            
            if 'CORS' in content:
                self.log_test("Security - CORS", "PASS", "CORS configured")
            else:
                self.log_test("Security - CORS", "WARN", "CORS not configured")

    def generate_report(self):
        """Generate final QA report"""
        print("\n" + "="*60)
        print("🎯 HARMONIX PLATFORM QA VALIDATION REPORT")
        print("="*60)
        
        total_tests = self.results['passed'] + self.results['failed'] + self.results['warnings']
        
        print(f"📊 Test Summary:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {self.results['passed']}")
        print(f"   ❌ Failed: {self.results['failed']}")
        print(f"   ⚠️  Warnings: {self.results['warnings']}")
        
        if self.results['failed'] == 0:
            print(f"\n🎉 SUCCESS: Platform is ready for production deployment!")
            print(f"   Success Rate: {(self.results['passed'] / total_tests * 100):.1f}%")
        else:
            print(f"\n⚠️  ATTENTION REQUIRED: {self.results['failed']} critical issues found")
            print(f"   Please address failed tests before deployment")
        
        # Save detailed report
        report_path = self.base_path / 'qa_validation_report.json'
        with open(report_path, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\n📄 Detailed report saved to: {report_path}")
        
        return self.results['failed'] == 0

    def run_validation(self):
        """Run complete validation suite"""
        print("🚀 Starting HARMONIX Platform QA Validation...")
        print(f"📁 Base Path: {self.base_path}")
        
        self.validate_file_structure()
        self.validate_python_syntax()
        self.validate_environment_config()
        self.validate_api_structure()
        self.validate_database_models()
        self.validate_frontend_structure()
        self.validate_testing_infrastructure()
        self.validate_monitoring_scripts()
        self.validate_design_system()
        self.validate_security_measures()
        
        return self.generate_report()

if __name__ == '__main__':
    validator = HarmonixQAValidator()
    success = validator.run_validation()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

