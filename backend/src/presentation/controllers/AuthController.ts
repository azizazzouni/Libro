import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../business/services/AuthService';

const authService = new AuthService();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const ACCESS_TOKEN_TTL  = 15 * 60 * 1000;        // 15 min
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_TTL,
  });
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_TTL,
    path: '/api/v1/auth/refresh', // scope refresh cookie to refresh endpoint only
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', { ...COOKIE_OPTIONS });
  res.clearCookie('refreshToken', { ...COOKIE_OPTIONS, path: '/api/v1/auth/refresh' });
}

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password } = req.body;
      const result = await authService.register(email, name, password);
      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.status(201).json({ success: true, data: { user: result.user } });
    } catch (err) { next(err); }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.json({ success: true, data: { user: result.user } });
    } catch (err) { next(err); }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Read refresh token from httpOnly cookie
      const refreshToken = req.cookies?.refreshToken as string | undefined;
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'No refresh token provided' });
      }
      const tokens = await authService.refreshTokens(refreshToken);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      res.json({ success: true, message: 'Tokens refreshed' });
    } catch (err) { next(err); }
  }

  async logout(_req: Request, res: Response) {
    clearAuthCookies(res);
    res.json({ success: true, message: 'Logged out successfully' });
  }

  async me(req: Request, res: Response) {
    res.json({ success: true, data: req.user });
  }
}
