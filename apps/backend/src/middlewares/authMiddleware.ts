import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

const secret = SECRET;

// Middleware to verify JWT token in Authorization header
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token not provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);

    // Safe type check to ensure decoded token has userId
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      req.user = { id: (decoded as any).userId };
      next();
    } else {
      res.status(403).json({ error: 'Malformed or invalid token.' });
    }
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
}
