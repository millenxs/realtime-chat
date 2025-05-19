import api from './api';
import { z } from 'zod';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  registerSchema.parse(data);
  const { confirmPassword, ...rest } = data;
  return api.post("/auth/register", rest);
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<{ data: LoginResponse }> => {
  loginSchema.parse(data);
  return api.post("/auth/login", data);
};
