import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export const requestLogger = pinoHttp({
  logger,
  // Generate a unique ID for every request, or use the one provided by a reverse proxy
  genReqId: (req) => req.headers['x-request-id'] || uuidv4(),
  // Attach the request ID to the response headers
  customProps: (req, res) => {
    // We attach the ID to the response header in a custom function so we don't interfere with Express's lifecycle.
    // However, it's cleaner to attach it directly in the middleware chain.
    // pino-http already attaches `req.id` to the request object.
    return {
      reqId: req.id,
    };
  },
  customSuccessMessage: (req, res, responseTime) => {
    return `[${req.method}] ${req.url} completed in ${responseTime}ms`;
  },
  customErrorMessage: (req, res, err) => {
    return `[${req.method}] ${req.url} failed with error`;
  }
});
