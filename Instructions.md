# Harmonix Platform - Comprehensive System Audit & Fix Plan

## Current Issues Identified

### 1. Email Configuration
- **Issue**: System emails may not be using "connect@harmonixdigital.com"
- **Fix**: Update all email sending functions to use correct sender/reply-to

### 2. Logo Assets
- **Issue**: Legacy logos may still exist in navbar/footer
- **Fix**: Replace all logo instances with monogram PNG variant

### 3. Responsive Design
- **Issue**: Dev boxes, code editors may have overflow issues on mobile
- **Fix**: Add proper responsive styling to all code containers

### 4. System Health Page
- **Issue**: Footer may have health widget instead of link
- **Fix**: Remove widget, add proper link to /system-health

### 5. Global Responsiveness
- **Issue**: Potential spacing violations of 8px grid system
- **Fix**: Audit all pages at 320px, 768px, 1440px breakpoints

### 6. Forms & Lead Capture
- **Issue**: Need to verify all forms work with dual CRM integration
- **Fix**: Test and fix any form submission issues

### 7. CTA Updates
- **Issue**: CTAs may not show updated text
- **Fix**: Update all "Reserve My Spot" to "Pay 30% Deposit & Get 15% Off + Priority Access"

### 8. Navigation & Auth Flows
- **Issue**: Auth redirects and protected routes need verification
- **Fix**: Ensure proper redirects for authenticated/unauthenticated users

## Implementation Plan

### Phase 1: Asset & Branding Updates
1. Update navbar logo to use monogram PNG
2. Update footer logo to use monogram PNG
3. Configure email settings for connect@harmonixdigital.com

### Phase 2: Responsive Design Fixes
1. Fix dev box containers with proper overflow handling
2. Audit all pages for 8px grid compliance
3. Fix any horizontal scroll issues

### Phase 3: Navigation & Links
1. Remove health widget from footer
2. Add "System Health" link to footer
3. Update all CTAs with new text

### Phase 4: Forms & Integration Testing
1. Test waitlist form submission
2. Test login/signup forms
3. Verify CRM and Google Sheets capture

### Phase 5: Auth & Flow Testing
1. Test protected route redirects
2. Verify dashboard access
3. Test logout functionality

### Phase 6: Final Verification
1. Run complete responsive audit
2. Take before/after screenshots
3. Generate final report

## Files to Modify
- `client/src/components/layout/navbar.tsx` - Logo update
- `client/src/components/layout/footer.tsx` - Logo & health link
- `server/routes.ts` - Email configuration
- `client/src/pages/home.tsx` - CTA updates
- `client/src/components/ui/` - Responsive fixes
- `client/src/lib/api.ts` - API error handling

## Success Criteria
- All logos use monogram PNG
- All emails from connect@harmonixdigital.com
- No horizontal scroll at any breakpoint
- All forms capture to both CRM systems
- CTAs show correct text
- System health link works
- Auth flows redirect properly
- 8px grid system compliance

## Timeline
Estimated completion: 45 minutes for all fixes and verification