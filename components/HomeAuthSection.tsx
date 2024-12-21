"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
// import Image from 'next/image';

function HomeAuthSection() {
  const router = useRouter();

  return (
    <section className="flex w-screen h-screen">
      <div className="flex items-center w-full bg-white z-10 bg-transparent">
        <div className="flex flex-col gap-4 justify-center items-center w-full sm:w-1/2 h-full">
          <h1>歡迎來到FireMessage</h1>
          <span className="flex flex-col items-center justify-center">
            <p>一起暢快聊天、消磨時間</p>
            <p>登入後，立即開聊</p>
          </span>
        </div>
        <div className="flex flex-col justify-center items-center w-full sm:w-1/2 h-full">
          <Button className="btn" onClick={() => router.push("/register")}>
            註冊
          </Button>
          <Button className="btn" onClick={() => router.push("/login")}>
            登入
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HomeAuthSection;
