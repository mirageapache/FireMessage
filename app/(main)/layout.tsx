import React from "react";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="fixed w-full md:max-w-[1200px] h-full">
        <Header />
        <div className="main-panel mt-[50px] sm:p-5 w-full h-full overflow-y-auto">{children}</div>
        <BottomNavbar />
      </div>
    </div>
  );
}
