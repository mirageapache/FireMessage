"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

function HomeAuthSection() {
  return (
    <section className="flex flex-col lg:flex-row justify-center w-screen h-screen lg:px-8">
      <div className="flex justify-center items-center">
        <Image
          className="w-[400px] sm:w-80 lg:w-full"
          src="/images/mobileImg.png"
          alt="mobileImg"
          width={500}
          height={500}
          priority
        />
      </div>
      <div className="flex flex-col gap-[30px] justify-center items-center lg:w-1/2 z-10 bg-transparent">
        <div className="flex flex-col justify-center items-center lg:justify-end w-full h-full text-white">
          <h1 className="text-3xl lg:text-5xl">歡迎來到FireMessage</h1>
          <span className="flex flex-col items-center justify-center mt-[10px]">
            <h5 className="lg:text-2xl">一起暢快聊天、消磨時間</h5>
            <h5 className="lg:text-2xl">登入後，立即開聊</h5>
          </span>
        </div>
        <div className="flex flex-col justify-center items-center lg:justify-start w-full sm:w-1/2 h-full">
          <Link
            href="/login"
            className="btn mb-5 bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-secondary-color)] text-white"
          >
            登入
          </Link>
          <Link
            href="/register"
            className="btn bg-white hover:bg-white text-[var(--brand-secondary-color)]"
          >
            註冊
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeAuthSection;
