import type { Request, Response, NextFunction } from 'express';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow requests from Replit domains and localhost
  const allowedOrigins = [
    'https://e96ad11e-e9ac-4e32-8c88-9d404cc11ea9-00-2cc30w1u4zq75.worf.replit.dev',
    'http://localhost:5000',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin as string)) {
    res.setHeader('Access-Control-Allow-Origin', origin as string);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}