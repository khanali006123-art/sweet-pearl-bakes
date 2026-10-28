import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[API Error]:', err);

  if (err instanceof ZodError) {
    const firstMessage = err.errors[0]?.message || 'Validation failed';
    res.status(400).json({
      success: false,
      message: firstMessage,
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';

  res.status(status).json({
    success: false,
    message
  });
}
