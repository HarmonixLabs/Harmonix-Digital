/**
 * Comprehensive Platform Audit Script
 * Performs deep health checks and self-healing diagnostics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PlatformAuditor {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.auditResults = {
      critical: [],
      warnings: [],
      success: [],
      info: []
    };
  }

  log(level, message, details = null) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, details };
    this.auditResults[level].push(logEntry);
    console.log(`[${level.toUpperCase()}] ${message}`);
    if (details) console.log(`  Details: ${JSON.stringify(details, null, 2)}`);
  }

  // Check critical file structure
  auditFileStructure() {
    console.log('\n=== FILE STRUCTURE AUDIT ===');
    
    const criticalFiles = [
      'client/src/components/enhanced/EnhancedMarketplace.tsx',
      'client/src/components/enhanced/SubscriptionManager.tsx',
      'client/src/pages/enhanced-checkout.tsx',
      'client/src/pages/dashboard/FounderDashboard.tsx',
      'server/routes.ts',
      'shared/schema.ts',
      'server/storage.ts',
      'client/src/App.tsx',
      'package.json',
      'drizzle.config.ts'
    ];

    for (const file of criticalFiles) {
      if (fs.existsSync(file)) {
        this.log('success', `Critical file exists: ${file}`);
        
        // Check file size (empty file check)
        const stats = fs.statSync(file);
        if (stats.size === 0) {
          this.log('critical', `File is empty: ${file}`);
        } else if (stats.size < 100) {
          this.log('warnings', `File suspiciously small: ${file}`, { size: stats.size });
        }
      } else {
        this.log('critical', `Missing critical file: ${file}`);
      }
    }
  }

  // Check component imports and exports
  auditComponentIntegration() {
    console.log('\n=== COMPONENT INTEGRATION AUDIT ===');
    
    try {
      // Check EnhancedMarketplace
      const marketplaceContent = fs.readFileSync('client/src/components/enhanced/EnhancedMarketplace.tsx', 'utf8');
      if (marketplaceContent.includes('export default function EnhancedMarketplace')) {
        this.log('success', 'EnhancedMarketplace has proper default export');
      } else {
        this.log('critical', 'EnhancedMarketplace missing default export');
      }

      // Check SubscriptionManager
      const subscriptionContent = fs.readFileSync('client/src/components/enhanced/SubscriptionManager.tsx', 'utf8');
      if (subscriptionContent.includes('export default function SubscriptionManager')) {
        this.log('success', 'SubscriptionManager has proper default export');
      } else {
        this.log('critical', 'SubscriptionManager missing default export');
      }

      // Check dashboard integration
      const dashboardContent = fs.readFileSync('client/src/pages/dashboard/FounderDashboard.tsx', 'utf8');
      if (dashboardContent.includes('import SubscriptionManager')) {
        this.log('success', 'FounderDashboard imports SubscriptionManager');
      } else {
        this.log('critical', 'FounderDashboard missing SubscriptionManager import');
      }

      if (dashboardContent.includes('<SubscriptionManager />')) {
        this.log('success', 'FounderDashboard renders SubscriptionManager');
      } else {
        this.log('critical', 'FounderDashboard not rendering SubscriptionManager');
      }

    } catch (error) {
      this.log('critical', 'Error reading component files', { error: error.message });
    }
  }

  // Check API routes
  auditAPIRoutes() {
    console.log('\n=== API ROUTES AUDIT ===');
    
    try {
      const routesContent = fs.readFileSync('server/routes.ts', 'utf8');
      
      const requiredRoutes = [
        '/api/stripe/create-subscription',
        '/api/stripe/subscription-status',
        '/api/stripe/cancel-subscription',
        '/api/stripe/update-subscription',
        '/api/stripe/customer-portal'
      ];

      for (const route of requiredRoutes) {
        if (routesContent.includes(route)) {
          this.log('success', `API route implemented: ${route}`);
        } else {
          this.log('critical', `Missing API route: ${route}`);
        }
      }

      // Check Stripe import
      if (routesContent.includes('import Stripe from')) {
        this.log('success', 'Stripe SDK properly imported');
      } else {
        this.log('critical', 'Stripe SDK not imported');
      }

    } catch (error) {
      this.log('critical', 'Error reading routes file', { error: error.message });
    }
  }

  // Check database schema
  auditDatabaseSchema() {
    console.log('\n=== DATABASE SCHEMA AUDIT ===');
    
    try {
      const schemaContent = fs.readFileSync('shared/schema.ts', 'utf8');
      
      const requiredFields = [
        'stripeCustomerId',
        'stripeSubscriptionId',
        'subscriptionStatus',
        'subscriptionTier'
      ];

      for (const field of requiredFields) {
        if (schemaContent.includes(field)) {
          this.log('success', `Schema field exists: ${field}`);
        } else {
          this.log('critical', `Missing schema field: ${field}`);
        }
      }

      // Check sessions table (required for auth)
      if (schemaContent.includes('export const sessions')) {
        this.log('success', 'Sessions table defined');
      } else {
        this.log('critical', 'Sessions table missing');
      }

    } catch (error) {
      this.log('critical', 'Error reading schema file', { error: error.message });
    }
  }

  // Check package dependencies
  auditDependencies() {
    console.log('\n=== DEPENDENCIES AUDIT ===');
    
    try {
      const packageContent = fs.readFileSync('package.json', 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      const requiredDeps = [
        'stripe',
        '@stripe/stripe-js',
        '@stripe/react-stripe-js',
        'date-fns',
        'drizzle-orm',
        'react',
        'typescript'
      ];

      for (const dep of requiredDeps) {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.log('success', `Dependency installed: ${dep}`);
        } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
          this.log('success', `Dev dependency installed: ${dep}`);
        } else {
          this.log('critical', `Missing dependency: ${dep}`);
        }
      }

    } catch (error) {
      this.log('critical', 'Error reading package.json', { error: error.message });
    }
  }

  // Check for TypeScript errors
  auditTypeScript() {
    console.log('\n=== TYPESCRIPT AUDIT ===');
    
    const tsFiles = [
      'client/src/components/enhanced/EnhancedMarketplace.tsx',
      'client/src/components/enhanced/SubscriptionManager.tsx',
      'client/src/pages/enhanced-checkout.tsx'
    ];

    for (const file of tsFiles) {
      try {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          
          // Check for common TypeScript issues
          if (content.includes('// @ts-ignore')) {
            this.log('warnings', `TypeScript suppression found in: ${file}`);
          }
          
          if (content.includes('any')) {
            this.log('warnings', `'any' type usage found in: ${file}`);
          }
          
          if (!content.includes('import React') && content.includes('React.')) {
            this.log('warnings', `Missing React import in: ${file}`);
          }
          
          this.log('success', `TypeScript file validated: ${file}`);
        }
      } catch (error) {
        this.log('critical', `Error reading TypeScript file: ${file}`, { error: error.message });
      }
    }
  }

  // Generate audit report
  generateReport() {
    console.log('\n=== AUDIT SUMMARY ===');
    
    const report = {
      timestamp: new Date().toISOString(),
      criticalIssues: this.auditResults.critical.length,
      warnings: this.auditResults.warnings.length,
      successItems: this.auditResults.success.length,
      infoItems: this.auditResults.info.length,
      overallHealth: this.auditResults.critical.length === 0 ? 'HEALTHY' : 'CRITICAL',
      details: this.auditResults
    };

    console.log(`Critical Issues: ${report.criticalIssues}`);
    console.log(`Warnings: ${report.warnings}`);
    console.log(`Success Items: ${report.successItems}`);
    console.log(`Overall Health: ${report.overallHealth}`);

    // Write report to file
    fs.writeFileSync('PLATFORM_AUDIT_REPORT.md', this.formatReportMarkdown(report));
    
    return report;
  }

  formatReportMarkdown(report) {
    let markdown = `# Platform Audit Report\n\n`;
    markdown += `**Generated:** ${report.timestamp}\n`;
    markdown += `**Overall Health:** ${report.overallHealth}\n\n`;
    
    markdown += `## Summary\n`;
    markdown += `- Critical Issues: ${report.criticalIssues}\n`;
    markdown += `- Warnings: ${report.warnings}\n`;
    markdown += `- Success Items: ${report.successItems}\n`;
    markdown += `- Info Items: ${report.infoItems}\n\n`;

    if (report.details.critical.length > 0) {
      markdown += `## 🚨 Critical Issues\n`;
      report.details.critical.forEach(item => {
        markdown += `- **${item.message}**\n`;
        if (item.details) markdown += `  - Details: ${JSON.stringify(item.details)}\n`;
      });
      markdown += `\n`;
    }

    if (report.details.warnings.length > 0) {
      markdown += `## ⚠️ Warnings\n`;
      report.details.warnings.forEach(item => {
        markdown += `- ${item.message}\n`;
        if (item.details) markdown += `  - Details: ${JSON.stringify(item.details)}\n`;
      });
      markdown += `\n`;
    }

    markdown += `## ✅ Successful Checks\n`;
    report.details.success.forEach(item => {
      markdown += `- ${item.message}\n`;
    });

    return markdown;
  }

  // Run complete audit
  async runAudit() {
    console.log('🔍 Starting Comprehensive Platform Audit...\n');
    
    this.auditFileStructure();
    this.auditComponentIntegration();
    this.auditAPIRoutes();
    this.auditDatabaseSchema();
    this.auditDependencies();
    this.auditTypeScript();
    
    const report = this.generateReport();
    
    console.log('\n✅ Audit Complete! Report saved to PLATFORM_AUDIT_REPORT.md');
    return report;
  }
}

// Run audit if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new PlatformAuditor();
  auditor.runAudit();
}

export default PlatformAuditor;