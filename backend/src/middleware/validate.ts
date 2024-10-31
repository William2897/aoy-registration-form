// In your backend/src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {logger} from '../utils/logger';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Validation errors:', { errors: errors.array() });  // Add this line
    return res.status(400).json({ 
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};