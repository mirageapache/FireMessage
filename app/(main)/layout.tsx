import React from "react";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Header />
      <div className="main-panel fixed flex justify-center items-center w-full h-full overflow-y-auto">
        <div className="w-full h-full md:max-w-[1200px]">{children}</div>
      </div>
      <BottomNavbar />
    </div>
  );
}
