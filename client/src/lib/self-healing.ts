import { z } from "zod";

// Health check types
export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'critical';
  message: string;
  timestamp: Date;
  canAutoFix: boolean;
  fix?: () => Promise<void>;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  checks: HealthCheck[];
  lastChecked: Date;
  autoFixesApplied: number;
}

// Self-healing monitor class
export class SelfHealingMonitor {
  private checks: Map<string, () => Promise<HealthCheck>> = new Map();
  private fixHistory: Array<{ check: string; timestamp: Date; success: boolean }> = [];
  private isMonitoring = false;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.registerDefaultChecks();
  }

  // Register default health checks
  private registerDefaultChecks() {
    // Form validation check
    this.registerCheck('formValidation', async () => {
      const forms = document.querySelectorAll('form');
      let issues = 0;

      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          if (!input.getAttribute('name')) issues++;
          if (input.getAttribute('type') === 'email' && !input.getAttribute('pattern')) issues++;
        });
      });

      return {
        name: 'Form Validation',
        status: issues > 0 ? 'degraded' : 'healthy',
        message: issues > 0 ? `${issues} form inputs need validation` : 'All forms validated',
        timestamp: new Date(),
        canAutoFix: true,
        fix: async () => {
          document.querySelectorAll('form').forEach(form => {
            this.enhanceFormValidation(form);
          });
        }
      };
    });

    // Layout responsiveness check
    this.registerCheck('layoutResponsiveness', async () => {
      const overflowing = this.checkHorizontalOverflow();
      const touchTargets = this.checkTouchTargets();
      const gridCompliance = this.check8pxGrid();

      const issues = overflowing.length + touchTargets.length + gridCompliance.length;

      return {
        name: 'Layout Responsiveness',
        status: issues > 10 ? 'critical' : issues > 0 ? 'degraded' : 'healthy',
        message: `${issues} responsive issues detected`,
        timestamp: new Date(),
        canAutoFix: true,
        fix: async () => {
          this.fixOverflowingElements(overflowing);
          this.fixTouchTargets(touchTargets);
          this.fixGridCompliance(gridCompliance);
        }
      };
    });

    // WebSocket connection check
    this.registerCheck('webSocketConnection', async () => {
      const wsConnected = (window as any).ws?.readyState === WebSocket.OPEN;

      return {
        name: 'WebSocket Connection',
        status: wsConnected ? 'healthy' : 'critical',
        message: wsConnected ? 'Connected' : 'Disconnected',
        timestamp: new Date(),
        canAutoFix: true,
        fix: async () => {
          if (!(window as any).ws || (window as any).ws.readyState !== WebSocket.OPEN) {
            this.reconnectWebSocket();
          }
        }
      };
    });

    // API health check
    this.registerCheck('apiHealth', async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();

        return {
          name: 'API Health',
          status: data.status === 'healthy' ? 'healthy' : 'degraded',
          message: data.message || 'API responding',
          timestamp: new Date(),
          canAutoFix: false
        };
      } catch (error) {
        return {
          name: 'API Health',
          status: 'critical',
          message: 'API not responding',
          timestamp: new Date(),
          canAutoFix: false
        };
      }
    });

    // Authentication state check
    this.registerCheck('authenticationState', async () => {
      const token = localStorage.getItem('token');
      const tokenExpired = this.isTokenExpired(token);

      return {
        name: 'Authentication',
        status: token && !tokenExpired ? 'healthy' : token && tokenExpired ? 'degraded' : 'healthy',
        message: token && tokenExpired ? 'Token expired' : token ? 'Authenticated' : 'Not authenticated',
        timestamp: new Date(),
        canAutoFix: token && tokenExpired,
        fix: async () => {
          if (token && tokenExpired) {
            await this.refreshAuthToken();
          }
        }
      };
    });
  }

  // Register a custom health check
  registerCheck(name: string, check: () => Promise<HealthCheck>) {
    this.checks.set(name, check);
  }

  // Run all health checks
  async runHealthChecks(): Promise<SystemHealth> {
    const results: HealthCheck[] = [];

    for (const [name, check] of this.checks) {
      try {
        const result = await check();
        results.push(result);

        // Auto-fix if possible and critical
        if (result.status === 'critical' && result.canAutoFix && result.fix) {
          console.log(`🔧 Auto-fixing: ${result.name}`);
          try {
            await result.fix();
            this.fixHistory.push({ check: name, timestamp: new Date(), success: true });
          } catch (error) {
            console.error(`Failed to auto-fix ${name}:`, error);
            this.fixHistory.push({ check: name, timestamp: new Date(), success: false });
          }
        }
      } catch (error) {
        results.push({
          name: name,
          status: 'critical',
          message: `Check failed: ${error}`,
          timestamp: new Date(),
          canAutoFix: false
        });
      }
    }

    const overallStatus = results.some(r => r.status === 'critical') ? 'critical' :
                         results.some(r => r.status === 'degraded') ? 'degraded' : 'healthy';

    return {
      overall: overallStatus,
      checks: results,
      lastChecked: new Date(),
      autoFixesApplied: this.fixHistory.filter(f => f.success).length
    };
  }

  // Start monitoring
  startMonitoring(intervalMs = 30000) {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.checkInterval = setInterval(() => {
      this.runHealthChecks().then(health => {
        console.log(`🏥 System Health: ${health.overall}`);
        
        // Emit custom event for UI updates
        window.dispatchEvent(new CustomEvent('system-health-update', { detail: health }));
      });
    }, intervalMs);

    // Run initial check
    this.runHealthChecks();
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
  }

  // Helper methods
  private checkHorizontalOverflow(): HTMLElement[] {
    const elements: HTMLElement[] = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > window.innerWidth) {
        elements.push(el as HTMLElement);
      }
    });
    return elements;
  }

  private checkTouchTargets(): HTMLElement[] {
    const smallTargets: HTMLElement[] = [];
    document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        smallTargets.push(el as HTMLElement);
      }
    });
    return smallTargets;
  }

  private check8pxGrid(): HTMLElement[] {
    const nonCompliant: HTMLElement[] = [];
    document.querySelectorAll('[class*="p-"], [class*="m-"], [class*="gap-"]').forEach(el => {
      const styles = window.getComputedStyle(el);
      const padding = parseFloat(styles.paddingTop);
      const margin = parseFloat(styles.marginTop);
      
      if ((padding % 8 !== 0 && padding > 0) || (margin % 8 !== 0 && margin > 0)) {
        nonCompliant.push(el as HTMLElement);
      }
    });
    return nonCompliant;
  }

  private fixOverflowingElements(elements: HTMLElement[]) {
    elements.forEach(el => {
      el.style.maxWidth = '100%';
      el.style.overflowX = 'auto';
    });
  }

  private fixTouchTargets(elements: HTMLElement[]) {
    elements.forEach(el => {
      el.style.minWidth = '44px';
      el.style.minHeight = '44px';
      el.style.padding = '12px';
    });
  }

  private fixGridCompliance(elements: HTMLElement[]) {
    elements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const padding = parseFloat(styles.paddingTop);
      const margin = parseFloat(styles.marginTop);
      
      if (padding % 8 !== 0 && padding > 0) {
        const newPadding = Math.round(padding / 8) * 8;
        el.style.padding = `${newPadding}px`;
      }
      
      if (margin % 8 !== 0 && margin > 0) {
        const newMargin = Math.round(margin / 8) * 8;
        el.style.margin = `${newMargin}px`;
      }
    });
  }

  private enhanceFormValidation(form: HTMLFormElement) {
    form.querySelectorAll('input, textarea').forEach(input => {
      // Add name attribute if missing
      if (!input.getAttribute('name')) {
        const type = input.getAttribute('type') || 'text';
        const placeholder = input.getAttribute('placeholder') || '';
        const name = placeholder.toLowerCase().replace(/\s+/g, '_') || `field_${Date.now()}`;
        input.setAttribute('name', name);
      }

      // Add email pattern
      if (input.getAttribute('type') === 'email' && !input.getAttribute('pattern')) {
        input.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
      }

      // Add phone pattern
      if (input.getAttribute('type') === 'tel' && !input.getAttribute('pattern')) {
        input.setAttribute('pattern', '[0-9]{3}-[0-9]{3}-[0-9]{4}');
      }

      // Add real-time validation
      input.addEventListener('blur', () => {
        const isValid = (input as HTMLInputElement).checkValidity();
        if (!isValid) {
          input.classList.add('border-red-500');
        } else {
          input.classList.remove('border-red-500');
        }
      });
    });

    // Add form submit handler if missing
    if (!form.onsubmit) {
      form.onsubmit = (e) => {
        if (!form.checkValidity()) {
          e.preventDefault();
          form.reportValidity();
        }
      };
    }
  }

  private reconnectWebSocket() {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
    (window as any).ws = new WebSocket(wsUrl);
    
    (window as any).ws.onopen = () => {
      console.log('WebSocket reconnected');
    };
    
    (window as any).ws.onerror = (error: any) => {
      console.error('WebSocket error:', error);
    };
  }

  private isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private async refreshAuthToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  }
}

// Export singleton instance
export const selfHealingMonitor = new SelfHealingMonitor();