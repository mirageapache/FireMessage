/* eslint-disable camelcase */
import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Inter, Noto_Sans_TC } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc',
});

export const metadata: Metadata = {
  title: 'FireMessage',
  description: 'FireMessage is a webApp like Discord social network',
  icons: {
    icon: '/icons/favicon.ico',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${inter.className} ${notoSansTC.className}`}>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
