/* eslint-disable camelcase */
import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Inter, Noto_Sans_TC } from 'next/font/google';
import AuthProvider from '@/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });
const notoSansTC = Noto_Sans_TC({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fire Message',
  description: 'A message Web App power by NextJS',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${notoSansTC.className}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
