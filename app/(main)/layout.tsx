"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const path = usePathname();
  const currentPath = path?.slice(1);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Header />
      <div
        className={cn(
          "fixed flex justify-center items-center w-full h-full overflow-y-auto",
          currentPath === "chatRoom" ? "h-svh" : "main-panel",
        )}
      >
        <div className="w-full h-full md:max-w-[1200px]">{children}</div>
      </div>
      <BottomNavbar />
    </div>
  );
}
