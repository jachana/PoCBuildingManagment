import { Response } from 'express';

interface ErrorDetail {
  field?: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: ErrorDetail[],
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function sendError(res: Response, error: AppError): void {
  res.status(error.statusCode).json({
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  });
}

export function handleError(res: Response, err: unknown): void {
  if (err instanceof AppError) {
    sendError(res, err);
    return;
  }
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
