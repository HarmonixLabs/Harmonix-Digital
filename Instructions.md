# HARMONIX Platform Self-Heal & QA Instructions

## CRITICAL IMPORT ERROR FIX (Priority 1)
**Issue**: SyntaxError: Importing binding name 'FadeIn' is not found
**Root Cause**: Missing or incorrect import in components
**Action**: Fix import errors immediately to restore platform functionality

## 1. LIVE PREVIEW CONNECTIVITY ISSUES

### Problem Analysis
- Changes not reflecting in live preview
- Potential build/compilation errors blocking updates
- Import/export mismatches causing runtime failures

### Fix Plan
1. Resolve all TypeScript/import errors blocking compilation
2. Restart development server with clean build
3. Verify hot module replacement (HMR) functionality
4. Check WebSocket connections for live updates

## 2. AUTHENTICATION FLOWS (Sign-In & Get Started)

### Current Issues
- Inconsistent login/signup button behavior
- Missing modal triggers
- Redirect logic not working properly

### Fix Plan
1. **Audit authentication entry points**:
   - Header "Sign In" button
   - Hero "Get Started" CTA
   - Marketplace login prompts
   
2. **Standardize auth flow**:
   - Create unified AuthModal component
   - Implement proper redirect after login/signup
   - Add loading states and error handling

3. **Test complete user journey**:
   - Anonymous → signup → email verify → dashboard
   - Returning user → login → redirect to intended page

## 3. GLOBAL NAVIGATION SYSTEM

### Missing/Broken Links
- Home navigation not returning to `/`
- Features page missing or not linked
- Admin panel access inconsistent

### Fix Plan
1. **Update Navbar component**:
   - Map all navigation items to correct routes
   - Add active state indicators
   - Ensure responsive mobile menu

2. **Route Registration**:
   - Verify all routes in App.tsx
   - Create missing page components as stubs
   - Implement proper 404 handling

3. **Navigation Structure**:
   ```
   Public: Home, Marketplace, Pricing, Demo, FAQ
   Authenticated: Dashboard, My Agents, Wallet, Settings
   Admin: Admin Panel, Analytics, System Status
   ```

## 4. FOOTER LINK MAPPING

### Missing Pages
- Terms of Service
- Privacy Policy  
- SMS Terms
- Contact page
- Careers page

### Fix Plan
1. Create missing legal/informational pages
2. Update Footer component with proper routing
3. Implement contact form functionality
4. Add career opportunities section

## 5. MARKETPLACE DESIGN & FUNCTIONALITY

### Design Issues
- Inconsistent card layouts
- Spacing and typography misalignment
- Deploy button behavior unclear

### Fix Plan
1. **Design System Standardization**:
   - Apply consistent card component
   - Standardize spacing using design tokens
   - Align typography hierarchy

2. **Deploy Button Logic**:
   ```typescript
   if (!user) {
     // Show login modal
     triggerAuthModal('signup')
   } else if (agent.available) {
     // Launch deployment flow
     initiateAgentDeployment(agent.id)
   } else {
     // Show waitlist signup
     showWaitlistModal(agent.id)
   }
   ```

## 6. PRICING PAGE LOADING ISSUES

### Problem
- Stuck on loading spinner
- Missing error states
- No retry mechanism

### Fix Plan
1. **Debug API endpoint**:
   - Verify `/api/products` response
   - Add error logging and monitoring
   - Implement fallback data structure

2. **Enhanced UX**:
   - Add retry button on failure
   - Implement skeleton loading states
   - Show detailed error messages

## 7. SŌL BRAIN PAGE FUNCTIONALITY

### Current State
- Non-functional or missing content
- No data wiring

### Fix Plan
1. **Content Architecture**:
   - Create comprehensive SŌL Brain component
   - Add interactive demo functionality
   - Implement agent network visualization

2. **Data Integration**:
   - Connect to agent performance APIs
   - Add real-time metrics display
   - Include waitlist signup integration

## 8. HOME PAGE COPY UPDATES

### Required Changes
- "First 280 customers" → "Limited time offer"
- Update all urgency messaging
- Maintain conversion optimization

### Fix Plan
1. Update all promotional banners
2. Implement dynamic urgency messaging
3. A/B test copy variations

## 9. LOGO & BRANDING REFRESH

### Issues
- Current logo doesn't match brand guidelines
- Inconsistent color usage (jade-blue + gold)

### Fix Plan
1. **Generate New Logo SVGs**:
   - Header logo: jade-forest blue primary, gold accent
   - Footer monogram: simplified version
   - Favicon: optimized icon variant

2. **Brand Consistency**:
   - Update all logo instances
   - Ensure proper scaling and contrast
   - Test across different backgrounds

## 10. END-TO-END FLOW VERIFICATION

### Critical User Journeys

#### A. Onboarding Flow
```
Anonymous User → Signup → Email Verify → Plan Select → Wizard → Dashboard
```
**Tests**:
- Email verification works
- Payment processing completes
- Onboarding wizard saves preferences
- Dashboard loads with correct data

#### B. Agent Deployment Flow
```
Dashboard → Agent List → Builder Preview → Deploy → Monitor
```
**Tests**:
- Agent selection works
- Customization saves properly
- Deployment triggers correctly
- Performance monitoring active

#### C. Marketplace Commerce
```
Browse → Filter → Select → Login Check → Deploy/Waitlist → Payment
```
**Tests**:
- Search and filtering functional
- Authentication gates work
- Payment processing secure
- Confirmation emails sent

#### D. Subscription Management
```
Billing Page → Update Plan → Payment Method → Confirm → Receipt
```
**Tests**:
- Current plan displays correctly
- Upgrade/downgrade works
- Payment method updates
- Billing history accurate

#### E. Admin Operations
```
Admin Login → Analytics → Pricing Edit → Promo Create → Deploy
```
**Tests**:
- Admin access control
- Real-time analytics
- Price modification works
- Promotional campaigns launch

## IMPLEMENTATION TIMELINE

### Phase 1: Critical Fixes (Immediate)
1. Fix import errors blocking compilation
2. Restore live preview functionality
3. Fix authentication modals
4. Update navigation routing

### Phase 2: Core Functionality (1-2 hours)
1. Complete marketplace redesign
2. Fix pricing page loading
3. Implement SŌL Brain page
4. Update branding assets

### Phase 3: Flow Verification (2-3 hours)
1. Test all end-to-end user journeys
2. Fix discovered issues
3. Implement error handling
4. Add monitoring and analytics

### Phase 4: Polish & Documentation (1 hour)
1. Update Developer Handoff
2. Create QA test scenarios
3. Performance optimization
4. Final deployment verification

## SUCCESS CRITERIA

✅ **Live preview reflects all changes immediately**
✅ **All navigation links work correctly**
✅ **Authentication flows are seamless**
✅ **Marketplace is fully functional with proper design**
✅ **Pricing page loads without issues**
✅ **SŌL Brain page is interactive and informative**
✅ **All end-to-end flows complete successfully**
✅ **Branding is consistent and professional**
✅ **Error handling is comprehensive**
✅ **Performance is optimized**

---

*This document will be updated as fixes are implemented and tested.*