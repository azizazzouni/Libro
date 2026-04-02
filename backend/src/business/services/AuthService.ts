import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { ConflictError } from '../exceptions/ConflictError';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { ValidationError } from '../exceptions/ValidationError';

const userRepo = new UserRepository();

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function signToken(payload: TokenPayload, expiresIn: string): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn } as jwt.SignOptions);
}

export class AuthService {
  async register(email: string, name: string, password: string) {
    if (!email || !name || !password) throw new ValidationError('All fields are required');
    if (password.length < 8) throw new ValidationError('Password must be at least 8 characters');

    const existing = await userRepo.findByEmail(email);
    if (existing) throw new ConflictError('Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepo.create({ email, name, passwordHash });

    const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: signToken(payload, '15m'),
      refreshToken: signToken(payload, '7d'),
    };
  }

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: signToken(payload, '15m'),
      refreshToken: signToken(payload, '7d'),
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET!) as TokenPayload;
      const newPayload: TokenPayload = { userId: payload.userId, email: payload.email, role: payload.role };
      return {
        accessToken: signToken(newPayload, '15m'),
        refreshToken: signToken(newPayload, '7d'),
      };
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }
}
