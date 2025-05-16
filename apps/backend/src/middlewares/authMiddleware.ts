import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'minha-chave-secreta';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
=======
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error('A variável JWT_SECRET não está definida no arquivo .env');
}

const secret = SECRET;

interface TokenPayload extends JwtPayload {
  id: number;
}

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
>>>>>>> origin/login-register-authentication
  }

  const token = authHeader.split(' ')[1];

  try {
<<<<<<< HEAD
    const decoded = jwt.verify(token, SECRET) as { id: number };
    req.user = decoded; // Adiciona o ID do usuário à requisição
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
=======
    const decoded = jwt.verify(token, secret);

    // Verificação segura do tipo
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      req.user = { id: (decoded as TokenPayload).id };
      next();
    } else {
      res.status(403).json({ error: 'Token malformado ou inválido.' });
    }
  } catch (err) {
    res.status(403).json({ error: 'Token inválido ou expirado.' });
>>>>>>> origin/login-register-authentication
  }
}
