/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { ZodError } from 'zod';
import { envVars } from '../config/env';
import AppError from '../errors/AppError';
import { handleZodError } from '../errors/handleZodError';

export const globalErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  if (envVars.NODE_ENV === 'development') {
    console.error('❌ Global Error Handler:', err);
  }

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let errorSources: { path: string; message: string }[] = [];
  let stack: string | undefined;

  if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources;
    stack = err.stack;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: '', message: err.message }];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: '', message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === 'development' ? err : undefined,
    stack: envVars.NODE_ENV === 'development' ? stack : undefined,
  });
};
