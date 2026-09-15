import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../db/database';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'mentor' | 'admin';
  selectedExam: string;
  selectedClass: string;
  totalXP: number;
  streakDays: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const xUserId = req.headers['x-user-id'] as string | undefined;

    let targetUserId = 'user_default';

    if (xUserId) {
      targetUserId = xUserId;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (token && token !== 'next_soch_student_token') {
        targetUserId = token;
      }
    }

    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(targetUserId) as any;

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        selectedExam: user.selected_exam,
        selectedClass: user.selected_class,
        totalXP: user.total_xp,
        streakDays: user.streak_days,
      };
    } else {
      // Fallback to default user if custom ID wasn't found
      const defaultUser = db.prepare('SELECT * FROM users WHERE id = ?').get('user_default') as any;
      if (defaultUser) {
        req.user = {
          id: defaultUser.id,
          email: defaultUser.email,
          name: defaultUser.name,
          role: defaultUser.role,
          selectedExam: defaultUser.selected_exam,
          selectedClass: defaultUser.selected_class,
          totalXP: defaultUser.total_xp,
          streakDays: defaultUser.streak_days,
        };
      }
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid authentication credentials required to access this resource',
    });
  }
  next();
}

export function requireRole(allowedRoles: ('student' | 'mentor' | 'admin')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Role '${req.user.role}' is not authorized to perform this operation`,
      });
    }
    next();
  };
}
