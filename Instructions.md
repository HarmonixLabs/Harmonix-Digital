# HARMONIX PLATFORM: AUTHENTICATION & FORMS DEBUG REPORT

**Generated:** June 28, 2025  
**Status:** CRITICAL ISSUES IDENTIFIED - FIXING REQUIRED

## EXECUTIVE SUMMARY

After comprehensive codebase analysis, I've identified multiple critical authentication and form submission issues preventing proper platform functionality. The problems stem from inconsistent API interfaces, missing authentication headers, and conflicting form handling patterns.

## CRITICAL ISSUES IDENTIFIED

### 1. **AUTH HOOK API MISMATCH** ⚠️ CRITICAL
**File:** `client/src/lib/auth.tsx`
**Problem:** Signup page calls `signup()` but auth hook only provides `register()`
- Line 16: `const { signup } = useAuth();` ❌ UNDEFINED
- Line 55: `await signup(formData.email, ...)` ❌ WILL FAIL
- Auth hook exports: `register`, `login`, `logout` ✅
- Expected: `signup` function missing ❌

### 2. **API REQUEST MISSING HEADERS** ⚠️ CRITICAL  
**File:** `client/src/lib/queryClient.ts`
**Problem:** No Authorization header sent with authenticated requests
- Line 15-24: `apiRequest()` function doesn't include JWT token
- Server expects: `Authorization: Bearer <token>` header
- Current: Only `Content-Type: application/json` sent
- Result: All authenticated requests return 401 Unauthorized

### 3. **INCONSISTENT API CLIENTS** ⚠️ HIGH
**Files:** `client/src/lib/api.ts` vs `client/src/lib/queryClient.ts`
**Problem:** Two different API utilities with conflicting interfaces
- `api.ts`: Includes auth headers, proper error handling
- `queryClient.ts`: Missing auth headers, basic error handling
- Auth hook uses `queryClient.ts` (broken)
- Forms should use `api.ts` (working)

### 4. **SERVER STRIPE API VERSION** ⚠️ MEDIUM
**File:** `server/routes.ts`
**Problem:** Using outdated Stripe API version
- Line 20: `"2024-11-20.acacia"` ❌ DEPRECATED
- Should be: `"2025-05-28.basil"` ✅
- TypeScript errors preventing proper compilation

### 5. **FORM VALIDATION INCONSISTENCIES** ⚠️ MEDIUM
**Files:** Login/Signup forms
**Problem:** Mixed validation patterns causing submission failures
- Some forms use react-hook-form + zod
- Others use basic useState + manual validation
- Inconsistent error handling across forms

## COMPREHENSIVE FIX PLAN

### PHASE 1: AUTH INFRASTRUCTURE REPAIR

#### Step 1.1: Fix Auth Hook API Interface
```typescript
// In client/src/lib/auth.tsx
// ADD missing signup function
const signup = async (email: string, password: string, name: string, phone?: string, company?: string) => {
  await registerMutation.mutateAsync({ email, password, name, phone, company });
};

// EXPORT in AuthContextType interface
signup: (email: string, password: string, name: string, phone?: string, company?: string) => Promise<void>;

// PROVIDE in AuthContext.Provider value
signup,
```

#### Step 1.2: Fix API Request Headers
```typescript
// In client/src/lib/queryClient.ts
// REPLACE apiRequest function with auth header support
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = localStorage.getItem('harmonix_token');
  
  const res = await fetch(url, {
    method,
    headers: {
      ...(data && { "Content-Type": "application/json" }),
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}
```

#### Step 1.3: Consolidate API Clients
```typescript
// STRATEGY: Make auth.tsx use api.ts instead of queryClient.ts
// Or: Add auth headers to queryClient.ts
// PREFER: Use api.ts for consistency
```

### PHASE 2: SERVER FIXES

#### Step 2.1: Update Stripe API Version
```typescript
// In server/routes.ts line 20
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // UPDATED VERSION
});
```

#### Step 2.2: Fix TypeScript Errors
```typescript
// Fix null assignment issues in CRM integration
// Add proper type guards and validation
// Handle optional user properties properly
```

### PHASE 3: FORM STANDARDIZATION

#### Step 3.1: Standardize Form Components
```typescript
// STRATEGY: Convert all forms to use react-hook-form + zod
// Benefits: Consistent validation, better error handling, type safety
// Target files: login.tsx, signup.tsx, all modal forms
```

#### Step 3.2: Error Handling Unification
```typescript
// Create centralized error handler for auth operations
// Consistent toast notifications across all forms
// Proper loading states and user feedback
```

### PHASE 4: TESTING & VALIDATION

#### Step 4.1: Authentication Flow Testing
- ✅ Registration with all required fields
- ✅ Login with valid credentials  
- ✅ Token storage and retrieval
- ✅ Protected route access
- ✅ CRM integration triggers

#### Step 4.2: Form Submission Testing
- ✅ All form fields validate properly
- ✅ Error messages display correctly
- ✅ Success flows redirect appropriately
- ✅ Loading states work consistently

## IMPLEMENTATION PRIORITY

### IMMEDIATE (< 30 min)
1. Fix auth hook signup function name
2. Add Authorization headers to apiRequest
3. Update Stripe API version

### SHORT-TERM (< 2 hours)  
1. Consolidate API client interfaces
2. Fix TypeScript compilation errors
3. Test complete auth flow

### MEDIUM-TERM (< 1 day)
1. Standardize all form components
2. Implement comprehensive error handling
3. Add proper loading states

## TECHNICAL REQUIREMENTS

### Dependencies Needed
- No new packages required
- Fix existing implementation gaps

### Environment Variables
- JWT_SECRET ✅ Available
- STRIPE_SECRET_KEY ✅ Available  
- GHL_API_KEY ✅ Available

### Database Schema
- User table structure ✅ Correct
- Organization relationships ✅ Functional
- Insert schemas ✅ Properly defined

## SUCCESS CRITERIA

### Authentication Working When:
✅ Users can register with email/password  
✅ Users can login with valid credentials  
✅ JWT tokens are properly stored and sent  
✅ Protected routes require authentication  
✅ CRM integration captures new registrations  

### Forms Working When:
✅ All input fields accept data properly  
✅ Validation errors display clearly  
✅ Submission shows loading states  
✅ Success/error feedback is consistent  
✅ Form data reaches server endpoints  

## MONITORING PLAN

### Pre-Fix Validation
- Test current auth flow (expect failures)
- Document specific error messages
- Verify server endpoint responses

### Post-Fix Validation  
- Complete registration flow end-to-end
- Login with created account
- Access protected dashboard
- Verify CRM contact creation

### Rollback Strategy
- Keep current auth.tsx as backup
- Test changes incrementally
- Revert individual components if needed

---

**NEXT ACTIONS:**
1. Implement Phase 1 fixes immediately
2. Test authentication flow
3. Proceed with remaining phases
4. Update this document with results

**ESTIMATED COMPLETION:** 2-4 hours for full resolution

---
*Generated by Harmonix Platform Diagnostic System*