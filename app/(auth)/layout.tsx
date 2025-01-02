import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col justify-center items-center h-screen p-3">
      <div className="block sm:hidden absolute top-[50px] left-0 ml-[40px] cursor-pointer">
        <Link href="/">
          <FontAwesomeIcon icon={faArrowLeft} className="w-[30px] h-[30px]" />
        </Link>
      </div>
      {children}
    </main>
  );
}
