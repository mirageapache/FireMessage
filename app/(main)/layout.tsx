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
        <div className="px-5 md:px-0 w-full md:max-w-[1200px] h-full">{children}</div>
      </div>
      <BottomNavbar />
    </div>
  );
}
