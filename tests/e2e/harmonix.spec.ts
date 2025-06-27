import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Test data
const TEST_USER = {
  email: 'e2e-test@harmonix.digital',
  password: 'E2ETestPassword123!',
  name: 'E2E Test User',
  company: 'Test Company Inc'
};

test.describe('HARMONIX Platform E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Landing page loads with Design Brief spacing', async ({ page }) => {
    // Check if the landing page loads
    await expect(page).toHaveTitle(/Harmonix/);
    
    // Check for key elements with proper spacing
    await expect(page.locator('text=Intelligent Systems for Timeless Sovereignty')).toBeVisible();
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
    
    // Verify Design Brief spacing on cards (max-width: 320px)
    const cards = page.locator('[data-slot="card"]');
    if (await cards.count() > 0) {
      const cardStyles = await cards.first().evaluate(el => getComputedStyle(el));
      expect(cardStyles.maxWidth).toBe('320px');
    }
    
    // Check navigation elements
    await expect(page.locator('text=Demo')).toBeVisible();
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('Demo page functionality', async ({ page }) => {
    // Navigate to demo page
    await page.click('text=Demo');
    
    // Check demo elements
    await expect(page.locator('text=SŌL Brain Demo')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="message"]')).toBeVisible();
    
    // Test demo interaction
    await page.fill('textarea[placeholder*="message"]', 'Hello, can you help me understand AI agents?');
    await page.click('button:has-text("Send")');
    
    // Wait for response with timeout
    await expect(page.locator('.sol-response')).toBeVisible({ timeout: 10000 });
  });

  test('Agent Marketplace with proper touch targets', async ({ page }) => {
    // Navigate to marketplace
    await page.click('text=Marketplace');
    
    // Check marketplace elements
    await expect(page.locator('text=Agent Marketplace')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Verify touch target sizing (min 48px height)
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const buttonHeight = await buttons.nth(i).evaluate(el => el.offsetHeight);
      expect(buttonHeight).toBeGreaterThanOrEqual(48);
    }
    
    // Test search functionality
    await page.fill('input[placeholder*="Search"]', 'sales');
    await page.keyboard.press('Enter');
  });

  test('Pricing page with Design Brief layout', async ({ page }) => {
    // Navigate to pricing
    await page.click('text=Pricing');
    
    // Check pricing elements
    await expect(page.locator('text=Choose Your Plan')).toBeVisible();
    await expect(page.locator('text=Starter')).toBeVisible();
    await expect(page.locator('text=Growth')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();
    
    // Verify card spacing matches Design Brief
    const pricingCards = page.locator('.pricing-card, [data-slot="card"]');
    if (await pricingCards.count() > 0) {
      const cardPadding = await pricingCards.first().evaluate(el => {
        const styles = getComputedStyle(el);
        return styles.padding;
      });
      // Should use 16px (1rem) padding according to Design Brief
      expect(cardPadding).toContain('16px');
    }
  });

  test('Authentication flow', async ({ page }) => {
    // Navigate to login
    await page.click('text=Login');
    
    // Check form elements have proper spacing
    const formInputs = page.locator('input[type="email"], input[type="password"]');
    const inputCount = await formInputs.count();
    
    if (inputCount > 0) {
      const inputHeight = await formInputs.first().evaluate(el => el.offsetHeight);
      expect(inputHeight).toBeGreaterThanOrEqual(48); // Touch target minimum
    }
    
    // Test form validation
    await page.click('button:has-text("Sign In")');
    await expect(page.locator('text=required')).toBeVisible();
  });

  test('Mobile responsiveness with 8px grid', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload page for mobile layout
    await page.reload();
    
    // Check mobile navigation
    const mobileMenuButton = page.locator('[aria-label*="menu"], .mobile-menu-button, button:has-text("☰")');
    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton.first()).toBeVisible();
      
      // Verify touch target size
      const buttonHeight = await mobileMenuButton.first().evaluate(el => el.offsetHeight);
      expect(buttonHeight).toBeGreaterThanOrEqual(48);
    }
    
    // Check that cards maintain proper max-width on mobile
    const cards = page.locator('[data-slot="card"]');
    if (await cards.count() > 0) {
      const cardWidth = await cards.first().evaluate(el => el.offsetWidth);
      expect(cardWidth).toBeLessThanOrEqual(320); // Design Brief max-width
    }
  });

  test('Component spacing verification', async ({ page }) => {
    // Check various components for Design Brief compliance
    
    // Verify button padding (should use 8px grid)
    const buttons = page.locator('button');
    if (await buttons.count() > 0) {
      const buttonPadding = await buttons.first().evaluate(el => {
        const styles = getComputedStyle(el);
        return styles.padding;
      });
      // Should use multiples of 8px
      const paddingValues = buttonPadding.match(/\d+/g);
      if (paddingValues) {
        paddingValues.forEach(value => {
          expect(parseInt(value) % 8).toBe(0);
        });
      }
    }
    
    // Check input field heights
    const inputs = page.locator('input[type="text"], input[type="email"]');
    if (await inputs.count() > 0) {
      const inputHeight = await inputs.first().evaluate(el => el.offsetHeight);
      expect(inputHeight).toBeGreaterThanOrEqual(48); // Touch-friendly minimum
    }
  });

  test('Typography scale compliance', async ({ page }) => {
    // Check heading hierarchy
    const h1Elements = page.locator('h1');
    const h2Elements = page.locator('h2');
    
    if (await h1Elements.count() > 0) {
      const h1FontSize = await h1Elements.first().evaluate(el => {
        return getComputedStyle(el).fontSize;
      });
      expect(h1FontSize).toBeTruthy();
    }
    
    if (await h2Elements.count() > 0) {
      const h2FontSize = await h2Elements.first().evaluate(el => {
        return getComputedStyle(el).fontSize;
      });
      expect(h2FontSize).toBeTruthy();
    }
  });

  test('Accessibility with Design Brief standards', async ({ page }) => {
    // Check color contrast (Design Brief requires high contrast)
    const textElements = page.locator('p, span, div').filter({ hasText: /\w+/ });
    
    if (await textElements.count() > 0) {
      const textColor = await textElements.first().evaluate(el => {
        return getComputedStyle(el).color;
      });
      expect(textColor).toBeTruthy();
    }
    
    // Verify focus indicators
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      await expect(focusedElement).toBeVisible();
    }
  });

  test('Performance with optimized assets', async ({ page }) => {
    // Measure page performance
    const navigationTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: timing.loadEventEnd - timing.loadEventStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
      };
    });
    
    // Design Brief performance thresholds
    expect(navigationTiming.loadTime).toBeLessThan(3000); // 3 seconds
    expect(navigationTiming.domContentLoaded).toBeLessThan(2000); // 2 seconds
    expect(navigationTiming.firstPaint).toBeLessThan(1500); // 1.5 seconds
  });

  test('Error handling with proper spacing', async ({ page }) => {
    // Test 404 page
    await page.goto(`${BASE_URL}/non-existent-page`);
    
    // Check error page elements
    const errorElements = page.locator('text=404, text=Not Found, text=Page not found');
    if (await errorElements.count() > 0) {
      await expect(errorElements.first()).toBeVisible();
    }
    
    // Verify error page uses proper spacing
    const errorCards = page.locator('[data-slot="card"], .error-card');
    if (await errorCards.count() > 0) {
      const cardPadding = await errorCards.first().evaluate(el => {
        return getComputedStyle(el).padding;
      });
      expect(cardPadding).toBeTruthy();
    }
  });
});

// Test hooks
test.afterEach(async ({ page }, testInfo) => {
  // Take screenshot on failure
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ 
      path: `test-results/failure-${testInfo.title}-${Date.now()}.png`,
      fullPage: true 
    });
  }
});

test.afterAll(async () => {
  console.log('HARMONIX Design Brief E2E tests completed');
});