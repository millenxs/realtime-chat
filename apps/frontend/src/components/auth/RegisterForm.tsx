'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function RegisterForm() {
  return (
    <form className="space-y-4">
      <Input type="text" placeholder="Nome" required />
      <Input type="email" placeholder="Email" required />
      <Input type="password" placeholder="Senha" required />
      <Button type="submit" className="w-full">Registrar</Button>
      <p className="text-sm text-center">
        Já tem conta? <Link href="/login" className="underline">Entrar</Link>
      </p>
    </form>
  );
}
