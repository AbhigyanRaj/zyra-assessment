import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Catch-all error handler for unhandled errors
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqId = res.locals.reqId || req.headers['x-request-id'] || 'unknown';
  
  // Log the full error internally, including the request ID for tracing
  logger.error({
    reqId,
    err,
    url: req.url,
    method: req.method,
  }, 'Unhandled Exception Caught');

  // Avoid leaking sensitive stack traces to the client in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    error: isProduction && statusCode === 500 ? 'Internal Server Error' : err.message || 'Unknown Error',
    requestId: reqId,
  });
};
