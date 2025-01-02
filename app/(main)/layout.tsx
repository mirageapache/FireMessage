import React from "react";
import Header from "@/components/Header";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col justify-center items-center h-screen p-3">
      <Header />
      {children}
    </main>
  );
}
