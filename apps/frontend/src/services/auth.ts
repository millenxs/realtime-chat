import api from './api';
import { z } from 'zod';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export const registerSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula")
      .regex(/[0-9]/, "Deve conter ao menos um número")
      .regex(/[^A-Za-z0-9]/, "Deve conter ao menos um caractere especial"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
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