import type { Request, Response } from 'express';
import { db } from './db';

export async function healthCheck(req: Request, res: Response) {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    await db.execute('SELECT 1');
    
    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'OPENAI_API_KEY',
      'STRIPE_SECRET_KEY',
      'GHL_API_KEY_HARMONIX'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'connected',
        openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing',
        stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing',
        ghl: process.env.GHL_API_KEY_HARMONIX ? 'configured' : 'missing',
        webhook: process.env.HARMONIX_GHL_WEBHOOK ? 'configured' : 'missing'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    };

    if (missingEnvVars.length > 0) {
      healthStatus.status = 'degraded';
      (healthStatus as any).warnings = `Missing environment variables: ${missingEnvVars.join(', ')}`;
    }

    res.status(healthStatus.status === 'healthy' ? 200 : 503).json(healthStatus);
    
  } catch (error) {
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${Date.now() - startTime}ms`
    };
    
    res.status(503).json(errorResponse);
  }
}

export async function readinessCheck(req: Request, res: Response) {
  try {
    // More comprehensive checks for readiness
    await db.execute('SELECT COUNT(*) FROM users LIMIT 1');
    
    // Check if all critical services are available
    const criticalServices = [
      process.env.DATABASE_URL,
      process.env.JWT_SECRET,
      process.env.OPENAI_API_KEY
    ];
    
    if (criticalServices.some(service => !service)) {
      throw new Error('Critical services not configured');
    }

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      message: 'Harmonix platform is ready to serve requests'
    });
    
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'System not ready'
    });
  }
}