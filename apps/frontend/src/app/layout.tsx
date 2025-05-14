import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeToggle';
import { LocaleProvider } from '@/components/LocaleSwitcher';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Auth App',
  description: 'Login/Register system with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LocaleProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}