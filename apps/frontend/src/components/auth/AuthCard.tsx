"use client";

import "../../styles/globals.css";
import { ReactNode } from "react";
import Link from "next/link";

interface AuthCardProps {
  title?: string;
  subtitle?: string;
  linkLabel?: string;
  linkHref?: string;
  linkText?: string;
  variant?: 'login' | 'register';
  children: ReactNode;
  onToggle?: () => void;
}

export function AuthCard({
  title,
  subtitle,
  linkLabel,
  linkHref,
  linkText,
  variant = 'login',
  children,
  onToggle,
}: AuthCardProps) {
  const defaultConfig = variant === 'login'
    ? {
        title: 'Welcome',
        subtitle: 'Sign in to your account',
        linkLabel: "Don't have an account?",
        linkText: 'Sign up',
        linkHref: '/register',
      }
    : {
        title: 'Join us',
        subtitle: 'Create your account',
        linkLabel: 'Already have an account?',
        linkText: 'Sign in',
        linkHref: '/',
      };

  const finalTitle = title ?? defaultConfig.title;
  const finalSubtitle = subtitle ?? defaultConfig.subtitle;
  const finalLinkLabel = linkLabel ?? defaultConfig.linkLabel;
  const finalLinkText = linkText ?? defaultConfig.linkText;
  const finalLinkHref = linkHref ?? defaultConfig.linkHref;

  return (
    <div className="max-w-md w-full bg-gradient-to-r from-blue-800 to-purple-600 rounded-xl shadow-2xl overflow-hidden p-8 space-y-8">
      <h2 className="text-center text-4xl font-extrabold text-white">
        {finalTitle}
      </h2>
      <p className="text-center text-gray-200">
        {finalSubtitle}
      </p>

      {children}

      <div className="text-center text-gray-300">
        {finalLinkLabel}{' '}
        <Link className="text-purple-300 hover:underline" href={finalLinkHref}>
          {finalLinkText}
        </Link>
      </div>
    </div>
  );
}