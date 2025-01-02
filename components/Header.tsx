"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

function Header() {
  return (
    <header className="fixed t-0 w-full h-[50px] flex items-center p-5">
      <nav className="flex justify-between items-center w-full md:max-w-[1200px]">
        <Link className="hidden sm:flex justify-center items-center" href="/">
          <Image
            src="/icons/fire_icon.png"
            alt="logo"
            width={30}
            height={30}
            priority
          />
          <h4 className="text-white ml-2">FireMessage</h4>
        </Link>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="切換深色模式"
          >
            <FontAwesomeIcon 
              icon={icon({ name: "moon", style: "solid" })}
              className="w-5 h-5"
            />
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="通知"
          >
            <FontAwesomeIcon 
              icon={icon({ name: "bell", style: "solid" })}
              className="w-5 h-5"
            />
          </button>
          <Link 
            href="/userProfile"
            className="hidden sm:block px-4 py-2 text-white hover:text-gray-300 transition-colors"
          >
            User Profile
          </Link>
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-colors sm:hidden"
            aria-label="功能選單"
          >
            <FontAwesomeIcon 
              icon={icon({ name: "bars", style: "solid" })}
              className="w-5 h-5"
            />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
