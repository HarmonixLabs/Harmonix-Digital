import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:5000';

// Test data
const TEST_USER = {
  email: 'e2e-test@harmonix.digital',
  password: 'E2ETestPassword123!',
  name: 'E2E Test User'
};

test.describe('HARMONIX Platform E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto(BASE_URL);
  });

  test('Landing page loads correctly', async ({ page }) => {
    // Check if the landing page loads
    await expect(page).toHaveTitle(/HARMONIX/);
    
    // Check for key elements
    await expect(page.locator('text=Scale your business with AI automation agents')).toBeVisible();
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
    
    // Check for navigation elements
    await expect(page.locator('text=Agents')).toBeVisible();
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Sign in')).toBeVisible();
  });

  test('User registration flow', async ({ page }) => {
    // Click on Get Started button
    await page.click('button:has-text("Get Started")');
    
    // Fill registration form
    await page.fill('input[name="name"]', TEST_USER.name);
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    
    // Accept terms
    await page.check('input[type="checkbox"]');
    
    // Submit form
    await page.click('button:has-text("Create Account")');
    
    // Check for success or redirect to dashboard
    await expect(page).toHaveURL(/dashboard|verify/);
  });

  test('User login flow', async ({ page }) => {
    // Navigate to login
    await page.click('text=Sign in');
    
    // Fill login form
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    
    // Submit login
    await page.click('button:has-text("Sign In")');
    
    // Check for dashboard redirect
    await expect(page).toHaveURL(/dashboard/);
    
    // Verify dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Current Agent')).toBeVisible();
  });

  test('Agent Builder workflow', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');
    
    // Navigate to Agent Builder
    await page.click('text=Agents');
    await page.click('button:has-text("Create New Agent")');
    
    // Fill agent details
    await page.fill('input[name="name"]', 'Test Sales Agent');
    await page.selectOption('select[name="type"]', 'sales');
    await page.fill('textarea[name="description"]', 'A test sales agent for E2E testing');
    
    // Configure agent settings
    await page.selectOption('select[name="model"]', 'gpt-4');
    await page.fill('input[name="temperature"]', '0.7');
    
    // Save agent
    await page.click('button:has-text("Save Agent")');
    
    // Verify agent creation
    await expect(page.locator('text=Agent created successfully')).toBeVisible();
    await expect(page.locator('text=Test Sales Agent')).toBeVisible();
  });

  test('Agent Demo functionality', async ({ page }) => {
    // Login and navigate to agent
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');
    
    // Go to demo suite
    await page.click('text=Demo Suite');
    
    // Select an agent for demo
    await page.click('.agent-card:first-child');
    await page.click('button:has-text("Start Demo")');
    
    // Send a test message
    await page.fill('textarea[placeholder="Type your message..."]', 'Hello, can you help me with sales?');
    await page.click('button:has-text("Send")');
    
    // Wait for response
    await expect(page.locator('.agent-response')).toBeVisible({ timeout: 10000 });
    
    // Verify response contains text
    const response = await page.locator('.agent-response').textContent();
    expect(response.length).toBeGreaterThan(0);
  });

  test('Marketplace browsing', async ({ page }) => {
    // Navigate to marketplace
    await page.click('text=Marketplace');
    
    // Check marketplace elements
    await expect(page.locator('text=Agent Marketplace')).toBeVisible();
    await expect(page.locator('input[placeholder="Search agents"]')).toBeVisible();
    
    // Check for agent cards
    await expect(page.locator('.agent-card')).toHaveCount({ min: 1 });
    
    // Test search functionality
    await page.fill('input[placeholder="Search agents"]', 'sales');
    await page.keyboard.press('Enter');
    
    // Verify search results
    await expect(page.locator('.agent-card:has-text("Sales")')).toBeVisible();
  });

  test('Billing and subscription', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');
    
    // Navigate to billing
    await page.click('text=Billing');
    
    // Check billing elements
    await expect(page.locator('text=Subscription')).toBeVisible();
    await expect(page.locator('text=Current Plan')).toBeVisible();
    
    // Check pricing plans
    await page.click('button:has-text("Upgrade Plan")');
    await expect(page.locator('text=Pro')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();
  });

  test('Dashboard analytics', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');
    
    // Check dashboard analytics
    await expect(page.locator('text=Harmony Tokens')).toBeVisible();
    await expect(page.locator('text=Completed Tasks')).toBeVisible();
    await expect(page.locator('text=Recent Tasks')).toBeVisible();
    
    // Check for charts/graphs
    await expect(page.locator('.chart-container')).toBeVisible();
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile navigation
    await expect(page.locator('.mobile-menu-button')).toBeVisible();
    
    // Open mobile menu
    await page.click('.mobile-menu-button');
    await expect(page.locator('.mobile-menu')).toBeVisible();
    
    // Check mobile-specific elements
    await expect(page.locator('text=Agents')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('Error handling', async ({ page }) => {
    // Test 404 page
    await page.goto(`${BASE_URL}/non-existent-page`);
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('button:has-text("Join Waitlist")')).toBeVisible();
    
    // Test form validation
    await page.goto(`${BASE_URL}/login`);
    await page.click('button:has-text("Sign In")');
    
    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('Accessibility compliance', async ({ page }) => {
    // Check for proper heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper form labels
    const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"]').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
      }
    }
    
    // Check for focus indicators
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('Performance metrics', async ({ page }) => {
    // Start performance monitoring
    await page.goto(BASE_URL);
    
    // Measure page load time
    const navigationTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: timing.loadEventEnd - timing.loadEventStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
      };
    });
    
    // Assert performance thresholds
    expect(navigationTiming.loadTime).toBeLessThan(3000); // 3 seconds
    expect(navigationTiming.domContentLoaded).toBeLessThan(2000); // 2 seconds
    expect(navigationTiming.firstPaint).toBeLessThan(1500); // 1.5 seconds
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
  // Cleanup test data if needed
  console.log('E2E tests completed');
});