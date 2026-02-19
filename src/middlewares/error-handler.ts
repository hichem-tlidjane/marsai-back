import type { ErrorRequestHandler } from 'express';
import AppError from '../helpers/AppError.js';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req,
  res,
  _next,
) => {
  console.error(err);
  let statusCode = 500;
  let message = 'Internal server error';
  let error = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    error = err.error;
  }

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    message = err.message;
  }

  res.status(statusCode).json({
    message,
    error,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
