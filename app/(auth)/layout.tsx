import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col justify-center items-center  w-screen h-screen p-3">
      <div className="absolute top-[50px] ml-[20px] w-full max-w-[400px] cursor-pointer">
        <FontAwesomeIcon icon={faArrowLeft} className="w-[30px] h-[30px]" />
      </div>
      {children}
    </main>
  );
}
