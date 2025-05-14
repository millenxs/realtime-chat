import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const service = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const user = await service.register(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await service.login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
