'use client';

import { AuthCard } from './AuthCard';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import AuthLayout from './AuthLayout';

interface AuthPageProps {
  variant: 'login' | 'register';
}

export default function AuthPage({ variant }: AuthPageProps) {
  return (
    <AuthLayout>
      <AuthCard variant={variant}>
        {variant === 'login' ? <LoginForm /> : <RegisterForm />}
      </AuthCard>
    </AuthLayout>
  );
}
