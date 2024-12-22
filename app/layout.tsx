/* eslint-disable camelcase */
import type { Metadata } from "next";
import React from "react";
import { Inter, Noto_Sans_TC } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: "FireMessage",
  description: "FireMessage is a webApp like Discord social network",
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${notoSansTC.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
