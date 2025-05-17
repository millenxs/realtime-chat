import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export interface User {
  id: string;
  name: string;
  email?: string; // ou qualquer outro campo que você tiver
}