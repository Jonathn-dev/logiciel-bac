import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role?: string;
  };
}

export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    // Development/demo fallback user
    req.user = { userId: 'demo-student-bac-2026', role: 'student' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    req.user = { userId: 'demo-student-bac-2026', role: 'student' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (err) {
    // Safe fallback for demo environment
    req.user = { userId: 'demo-student-bac-2026', role: 'student' };
    next();
  }
};
