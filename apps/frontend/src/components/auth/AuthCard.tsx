'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeProvider } from '../ThemeToggle';
import { LocaleProvider } from '../LocaleSwitcher';

interface AuthCardProps {
  children: ReactNode;
  variant: 'login' | 'register';
}

export function AuthCard({ children, variant }: AuthCardProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-10 p-6">
            {/* Lado da animação do Rive */}
            <div className="w-full md:w-1/2">
              <div className="w-full h-[300px] bg-muted rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground">Rive Animation Aqui</p>
              </div>
            </div>

            {/* Card de login/cadastro */}
            <div className="w-full md:w-1/2">
              <Card className="p-4 shadow-xl">
                <CardContent>
                  <h1 className="text-2xl font-bold capitalize mb-4">{variant}</h1>
                  {children}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </LocaleProvider>
    </ThemeProvider>
  );
}
