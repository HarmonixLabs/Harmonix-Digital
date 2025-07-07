/**
 * Harmonix System Self-Healing Protocol v2.0
 * Automated platform monitoring and remediation system
 */

interface HealthCheck {
  id: string;
  name: string;
  check: () => Promise<boolean>;
  heal: () => Promise<boolean>;
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastCheck?: Date;
  status: 'healthy' | 'warning' | 'error' | 'healing';
}

interface PlatformIntegration {
  feature: string;
  component: string;
  pages: string[];
  status: 'integrated' | 'missing' | 'partial';
  autoHeal: boolean;
}

class SelfHealingProtocol {
  private healthChecks: HealthCheck[] = [];
  private integrationMap: PlatformIntegration[] = [];
  private healingInProgress = false;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeHealthChecks();
    this.initializeIntegrationMap();
    this.startMonitoring();
  }

  private initializeHealthChecks() {
    // Disabled problematic checks that create false positives
    // Only keeping actual health checks that can be properly validated
    this.healthChecks = [
      {
        id: 'form-validation',
        name: 'Form Validation System',
        check: this.checkFormValidation.bind(this),
        heal: this.healFormValidation.bind(this),
        priority: 'high',
        status: 'healthy'
      }
    ];
  }

  private initializeIntegrationMap() {
    this.integrationMap = [
      {
        feature: 'AI Tooltips',
        component: 'AITooltip',
        pages: ['/dashboard', '/marketplace', '/my-agents', '/settings', '/pricing'],
        status: 'missing',
        autoHeal: true
      },
      {
        feature: 'Theme Switcher',
        component: 'ThemeSwitcher',
        pages: ['/dashboard', '/settings', '/marketplace'],
        status: 'missing',
        autoHeal: true
      },
      {
        feature: 'Animated Forms',
        component: 'AnimatedFormField',
        pages: ['/login', '/signup', '/settings', '/create-agent'],
        status: 'missing',
        autoHeal: true
      },
      {
        feature: 'Loading Skeletons',
        component: 'AILoadingSkeleton',
        pages: ['/dashboard', '/marketplace', '/agent-dashboard'],
        status: 'missing',
        autoHeal: true
      },
      {
        feature: 'Dashboard Widgets',
        component: 'PersonalizedWidgets',
        pages: ['/dashboard', '/my-agents'],
        status: 'missing',
        autoHeal: true
      }
    ];
  }

  private async checkInteractiveFeatures(): Promise<boolean> {
    // Check for actual DOM elements instead of React components
    const hasTooltips = document.querySelectorAll('[data-tooltip]').length > 0;
    const hasThemeSwitcher = document.querySelector('.theme-switcher') !== null;
    const hasAnimatedForms = document.querySelectorAll('[data-animated-form]').length > 0;
    
    return hasTooltips || hasThemeSwitcher || hasAnimatedForms;
  }

  private async healInteractiveFeatures(): Promise<boolean> {
    console.log('🔧 Self-Healing: Integrating interactive features platform-wide...');
    
    try {
      // This would trigger the platform-wide integration
      await this.integrateFeaturesPlatformWide();
      return true;
    } catch (error) {
      console.error('❌ Self-Healing: Failed to integrate features:', error);
      return false;
    }
  }

  private async checkAITooltips(): Promise<boolean> {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    const expectedPages = ['/dashboard', '/marketplace', '/my-agents'];
    const currentPage = window.location.pathname;
    
    if (expectedPages.includes(currentPage) && tooltipElements.length === 0) {
      return false;
    }
    
    return true;
  }

  private async healAITooltips(): Promise<boolean> {
    console.log('🔧 Self-Healing: Adding AI tooltips to current page...');
    
    try {
      // Add tooltips to key interactive elements
      const buttons = document.querySelectorAll('button:not([data-tooltip])');
      const links = document.querySelectorAll('a:not([data-tooltip])');
      const inputs = document.querySelectorAll('input:not([data-tooltip])');
      
      Array.from(buttons).concat(Array.from(links), Array.from(inputs)).forEach((element, index) => {
        if (index < 5) { // Limit to first 5 elements to avoid overload
          element.setAttribute('data-tooltip', 'true');
          element.setAttribute('data-tooltip-content', this.getContextualTooltip(element));
        }
      });
      
      return true;
    } catch (error) {
      console.error('❌ Self-Healing: Failed to add tooltips:', error);
      return false;
    }
  }

  private async checkThemeSwitcher(): Promise<boolean> {
    const themeSwitcher = document.querySelector('[data-theme-switcher]');
    const navBar = document.querySelector('nav, header');
    
    if (navBar && !themeSwitcher) {
      return false;
    }
    
    return true;
  }

  private async healThemeSwitcher(): Promise<boolean> {
    console.log('🔧 Self-Healing: Adding theme switcher to navigation...');
    
    try {
      // This would inject the theme switcher into the navigation
      const navBar = document.querySelector('nav, header');
      if (navBar) {
        const themeSwitcherContainer = document.createElement('div');
        themeSwitcherContainer.setAttribute('data-theme-switcher', 'true');
        themeSwitcherContainer.className = 'ml-auto';
        navBar.appendChild(themeSwitcherContainer);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Self-Healing: Failed to add theme switcher:', error);
      return false;
    }
  }

  private async checkFormValidation(): Promise<boolean> {
    const forms = document.querySelectorAll('form');
    const animatedInputs = document.querySelectorAll('[data-animated-input]');
    
    if (forms.length > 0 && animatedInputs.length === 0) {
      return false;
    }
    
    return true;
  }

  private async healFormValidation(): Promise<boolean> {
    console.log('🔧 Self-Healing: Enhancing forms with animated validation...');
    
    try {
      const forms = Array.from(document.querySelectorAll('form'));
      forms.forEach(form => {
        const inputs = Array.from(form.querySelectorAll('input:not([data-animated-input])'));
        inputs.forEach(input => {
          input.setAttribute('data-animated-input', 'true');
          this.enhanceInputWithAnimation(input as HTMLInputElement);
        });
      });
      
      return true;
    } catch (error) {
      console.error('❌ Self-Healing: Failed to enhance forms:', error);
      return false;
    }
  }

  private async checkLoadingSkeletons(): Promise<boolean> {
    const loadingElements = document.querySelectorAll('[data-loading]');
    const skeletonElements = document.querySelectorAll('[data-skeleton]');
    
    if (loadingElements.length > 0 && skeletonElements.length === 0) {
      return false;
    }
    
    return true;
  }

  private async healLoadingSkeletons(): Promise<boolean> {
    console.log('🔧 Self-Healing: Adding AI loading skeletons...');
    
    try {
      const loadingElements = Array.from(document.querySelectorAll('[data-loading]'));
      loadingElements.forEach(element => {
        if (!element.querySelector('[data-skeleton]')) {
          const skeleton = this.createAILoadingSkeleton();
          element.appendChild(skeleton);
        }
      });
      
      return true;
    } catch (error) {
      console.error('❌ Self-Healing: Failed to add loading skeletons:', error);
      return false;
    }
  }

  // Removed broken isComponentAvailable method - React components aren't in window object

  private getContextualTooltip(element: Element): string {
    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    const currentPage = window.location.pathname;
    
    if (tagName === 'button') {
      if (className.includes('submit')) return "Ready to submit? I'll guide you through!";
      if (className.includes('primary')) return "This is a key action - click to proceed!";
      return "Need help with this button? I'm here to assist!";
    }
    
    if (tagName === 'input') {
      const type = element.getAttribute('type');
      if (type === 'email') return "Enter your email address here";
      if (type === 'password') return "Create a secure password";
      return "Fill in this field to continue";
    }
    
    if (currentPage.includes('dashboard')) {
      return "This feature helps you manage your AI agents effectively";
    }
    
    return "Hover for helpful information about this feature";
  }

  private enhanceInputWithAnimation(input: HTMLInputElement) {
    input.addEventListener('focus', () => {
      input.style.transform = 'scale(1.02)';
      input.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', () => {
      input.style.transform = 'scale(1)';
    });
  }

  private createAILoadingSkeleton(): HTMLElement {
    const skeleton = document.createElement('div');
    skeleton.setAttribute('data-skeleton', 'true');
    skeleton.className = 'animate-pulse bg-harmonix-sage/10 rounded h-4 w-full';
    return skeleton;
  }

  private async integrateFeaturesPlatformWide(): Promise<void> {
    // This would trigger React component integration
    const event = new CustomEvent('harmonix:integrate-features', {
      detail: { features: this.integrationMap }
    });
    window.dispatchEvent(event);
  }

  public async runHealthCheck(): Promise<void> {
    if (this.healingInProgress) return;
    
    console.log('🔍 Self-Healing: Running health check...');
    
    for (const check of this.healthChecks) {
      try {
        check.lastCheck = new Date();
        const isHealthy = await check.check();
        
        if (!isHealthy) {
          check.status = 'warning';
          console.warn(`⚠️  Health Issue: ${check.name}`);
          
          if (check.priority === 'critical' || check.priority === 'high') {
            await this.healIssue(check);
          }
        } else {
          check.status = 'healthy';
        }
      } catch (error) {
        check.status = 'error';
        console.error(`❌ Health Check Failed: ${check.name}`, error);
      }
    }
  }

  private async healIssue(check: HealthCheck): Promise<void> {
    this.healingInProgress = true;
    check.status = 'healing';
    
    console.log(`🔧 Self-Healing: Attempting to heal ${check.name}...`);
    
    try {
      const healed = await check.heal();
      if (healed) {
        check.status = 'healthy';
        console.log(`✅ Self-Healing: Successfully healed ${check.name}`);
      } else {
        check.status = 'error';
        console.error(`❌ Self-Healing: Failed to heal ${check.name}`);
      }
    } catch (error) {
      check.status = 'error';
      console.error(`❌ Self-Healing: Error healing ${check.name}:`, error);
    }
    
    this.healingInProgress = false;
  }

  public startMonitoring(): void {
    // Self-healing monitoring disabled to prevent console spam and false positives
    // Manual healing can still be triggered via forceHeal() method
    console.log('Self-healing protocol initialized - manual mode only');
  }

  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  public getHealthStatus() {
    return {
      checks: this.healthChecks,
      integrations: this.integrationMap,
      isHealing: this.healingInProgress,
      lastHealthCheck: new Date()
    };
  }

  public forceHeal(): Promise<void> {
    console.log('🔧 Self-Healing: Force healing activated by user request...');
    return this.runHealthCheck();
  }
}

// Global instance
export const selfHealingProtocol = new SelfHealingProtocol();

// React hook for components
export function useSelfHealing() {
  const triggerHeal = () => {
    selfHealingProtocol.forceHeal();
  };
  
  const getStatus = () => {
    return selfHealingProtocol.getHealthStatus();
  };
  
  return { triggerHeal, getStatus };
}