import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex justify-center items-center w-screen h-screen p-3">
      {children}
    </main>
  );
}
