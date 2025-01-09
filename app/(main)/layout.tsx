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
        <div className="main-panel mb-[50px] sm:mt-[50px] sm:px-5 w-full h-full">{children}</div>
        <BottomNavbar />
      </div>
    </div>
  );
}
