'use client';

import { useEffect, useState } from 'react';
import i18n from '@/lib/i18n';

export function LanguageSwitcher() {
  const [language, setLanguage] = useState('pt');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') || 'pt';
    i18n.changeLanguage(storedLang);
    setLanguage(storedLang);
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    setLanguage(newLang);
  };

  if (!mounted) return null;

  return (
    <button onClick={toggleLanguage} className='text-dark'>
      {language === 'pt' ? 'PT' : 'EN'}
    </button>
  );
}
