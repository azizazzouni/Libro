import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../business/exceptions/AppError';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma unique constraint
  if ((err as { code?: string }).code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Resource already exists' });
  }
  if ((err as { code?: string }).code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ success: false, message: 'Internal server error' });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
}
