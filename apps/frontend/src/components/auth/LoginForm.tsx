'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function LoginForm() {
  return (
    <form className="space-y-4">
      <Input type="email" placeholder="Email" required />
      <Input type="password" placeholder="Senha" required />
      <Button type="submit" className="w-full">Entrar</Button>
      <p className="text-sm text-center">
        Não tem conta? <Link href="/register" className="underline">Cadastre-se</Link>
      </p>
    </form>
  );
}