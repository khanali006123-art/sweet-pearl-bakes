import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { localStore } from '../config/store';
import { AdminLoginSchema } from '@sweetpearl/shared';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'sweet_pearl_bakes_super_secure_jwt_secret_key_2026';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = AdminLoginSchema.parse(req.body);

    const user = localStore.getData().adminUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
}

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  res.json({
    success: true,
    data: req.user
  });
}
