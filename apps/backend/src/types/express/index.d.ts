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
  email?: string; 
}