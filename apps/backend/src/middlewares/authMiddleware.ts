import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error('A variável JWT_SECRET não está definida no arquivo .env');
}

const secret = SECRET;

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);

    // Verificação segura do tipo
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
  req.user = { id: (decoded as any).userId };
  next();
} else {
      res.status(403).json({ error: 'Token malformado ou inválido.' });
    }
  } catch (err) {
    res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
}
