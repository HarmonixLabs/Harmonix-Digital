import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { storage } from '../storage';
import { insertUserSchema, insertOrganizationSchema } from '@shared/schema';
import { updateCRM } from '../ghl-integration';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "harmonix-secret-key";

// Request validation schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  teamSize: z.string().optional(),
  marketingConsent: z.boolean().default(false),
  smsConsent: z.boolean().default(false),
  acceptTerms: z.boolean().refine(val => val === true, 'Terms must be accepted')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Helper function to log user actions
async function logUserAction(userId: number, action: string, details?: any, req?: any) {
  try {
    await storage.createAuditLog({
      userId,
      action,
      details: details || {},
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get('User-Agent')
    });
  } catch (error) {
    console.error('Failed to log user action:', error);
  }
}

// Helper function to generate verification token
function generateVerificationToken(): string {
  return require('crypto').randomBytes(32).toString('hex');
}

// Register endpoint with comprehensive validation
router.post('/register', async (req, res) => {
  try {
    // Validate request data
    const validatedData = registerSchema.parse(req.body);
    
    // Check if email already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email already registered',
          details: { email: ['This email is already registered'] }
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create organization for the user
    const organizationData = insertOrganizationSchema.parse({
      name: validatedData.company || `${validatedData.name}'s Organization`,
      slug: `org-${Date.now()}`,
      planType: 'trial',
      tokenQuota: 1000
    });

    const organization = await storage.createOrganization(organizationData);

    // Create user - check if this is the platform owner
    const isPlatformOwner = validatedData.email.toLowerCase().trim() === 'harmonix.hq@gmail.com';
    
    const userData = insertUserSchema.parse({
      email: validatedData.email.toLowerCase().trim(),
      password: hashedPassword,
      name: validatedData.name.trim(),
      organizationId: organization.id,
      role: isPlatformOwner ? 'super_admin' : 'admin',
      tokenBalance: isPlatformOwner ? 10000 : 500, // Super admin gets more starting tokens
      onboardingCompleted: false,
      onboardingData: JSON.stringify({
        phone: validatedData.phone,
        company: validatedData.company,
        industry: validatedData.industry,
        teamSize: validatedData.teamSize,
        marketingConsent: validatedData.marketingConsent,
        smsConsent: validatedData.smsConsent,
        registrationSource: 'platform_direct'
      })
    });

    const user = await storage.createUser(userData);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Log registration
    await logUserAction(user.id, 'registration', {
      industry: validatedData.industry,
      teamSize: validatedData.teamSize,
      marketingConsent: validatedData.marketingConsent,
      smsConsent: validatedData.smsConsent
    }, req);

    // Update CRM (async, don't block response)
    updateCRM({
      type: 'user_registered',
      userId: user.id,
      email: user.email,
      name: user.name,
      company: validatedData.company,
      industry: validatedData.industry,
      phone: validatedData.phone
    }).catch(error => console.error('CRM update failed:', error));

    // Response
    res.status(201).json({
      success: true,
      data: {
        user: { ...user, password: undefined },
        organization,
        token,
        subscription: {
          status: 'trial',
          trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      message: 'Registration successful. Welcome to your 7-day free trial!'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors.reduce((acc, err) => {
            const field = err.path[0];
            if (!acc[field]) acc[field] = [];
            acc[field].push(err.message);
            return acc;
          }, {} as Record<string, string[]>)
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Registration failed. Please try again.',
        retryAfter: 30
      }
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await storage.getUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid credentials'
        }
      });
    }

    const validPassword = await bcrypt.compare(validatedData.password, user.password);
    if (!validPassword) {
      await logUserAction(user.id, 'login_failed', { reason: 'invalid_password' }, req);
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid credentials'
        }
      });
    }

    const organization = await storage.getOrganization(user.organizationId!);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Update last login
    await storage.updateUser(user.id, {
      updatedAt: new Date()
    });

    // Log successful login
    await logUserAction(user.id, 'login_success', {}, req);

    res.json({
      success: true,
      data: {
        user: { ...user, password: undefined },
        organization,
        token
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors.reduce((acc, err) => {
            const field = err.path[0];
            if (!acc[field]) acc[field] = [];
            acc[field].push(err.message);
            return acc;
          }, {} as Record<string, string[]>)
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Login failed. Please try again.'
      }
    });
  }
});

// Get current user endpoint
router.get('/me', async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Authentication required'
        }
      });
    }

    const organization = await storage.getOrganization(req.user.organizationId!);
    
    res.json({
      success: true,
      data: {
        user: { ...req.user, password: undefined },
        organization
      }
    });

  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get user data'
      }
    });
  }
});

// Password reset request
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email is required'
        }
      });
    }

    const user = await storage.getUserByEmail(email.toLowerCase().trim());
    
    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.'
    });

    if (user) {
      // Generate reset token and send email (implement email service)
      const resetToken = generateVerificationToken();
      
      // Store reset token with expiration (implement in storage)
      await logUserAction(user.id, 'password_reset_requested', { email }, req);
      
      // TODO: Send password reset email
      console.log(`Password reset token for ${email}: ${resetToken}`);
    }

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Password reset failed. Please try again.'
      }
    });
  }
});

// Logout endpoint
router.post('/logout', async (req: any, res) => {
  try {
    if (req.user) {
      await logUserAction(req.user.id, 'logout', {}, req);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Logout failed'
      }
    });
  }
});

export default router;