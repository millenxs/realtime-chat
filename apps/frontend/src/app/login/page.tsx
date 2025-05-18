'use client';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
      <AuthCard variant="login">
        <LoginForm />
      </AuthCard>
  );
}
