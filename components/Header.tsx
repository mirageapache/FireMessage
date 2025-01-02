"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

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
        {/* <div>
          <button type="button" className="hidden sm:inline-block">
            <FontAwesomeIcon icon={icon({ name: "moon", style: "solid" })} />
          </button>
          <button type="button" className="hidden sm:inline-block">
            <FontAwesomeIcon icon={icon({ name: "bell", style: "solid" })} />
          </button>
          <Link href="/userProfile">User Profile</Link>
          <button type="button" className="inline-block sm:hidden">
            <FontAwesomeIcon
              icon={icon({ name: "hamburger", style: "solid" })}
            />
          </button>
        </div> */}
      </nav>
    </header>
  );
}

export default Header;
