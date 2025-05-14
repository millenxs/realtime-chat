'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import i18n from '@/lib/i18n'; // Supondo que seu i18n esteja em lib/i18n.ts

interface Props {
  children: ReactNode;
}

export function LocaleProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'pt';
    i18n.changeLanguage(lang);
  }, [pathname]);

  return <>{children}</>;
}
