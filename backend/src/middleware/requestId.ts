import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers['x-request-id'] || uuidv4();
  req.headers['x-request-id'] = reqId; // Ensure it's on the request
  res.setHeader('x-request-id', reqId); // Send it back to the client
  
  // Attach to Express locals for easy access in controllers if needed
  res.locals.reqId = reqId; 
  
  next();
};
