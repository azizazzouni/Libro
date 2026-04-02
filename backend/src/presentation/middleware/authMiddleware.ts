import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../business/exceptions/UnauthorizedError';
import { ForbiddenError } from '../../business/exceptions/ForbiddenError';
import { TokenPayload } from '../../business/services/AuthService';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  // 1. Try httpOnly cookie first
  const tokenFromCookie = req.cookies?.accessToken as string | undefined;

  // 2. Fallback to Authorization header (for API clients / mobile)
  const authHeader = req.headers['authorization'];
  const tokenFromHeader =
    authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  const token = tokenFromCookie ?? tokenFromHeader;

  if (!token) return next(new UnauthorizedError('No token provided'));

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') return next(new ForbiddenError('Admin access required'));
  next();
}
