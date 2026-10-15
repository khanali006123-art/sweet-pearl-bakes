import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sweet_pearl_bakes_super_secure_jwt_secret_key_2026';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    name: string;
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. Please sign in to admin dashboard.' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
}
