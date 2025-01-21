"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faMoon,
  faRightFromBracket,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "@/lib/auth";
import { authResponseType } from "@/types/authType";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import { isEmpty } from "lodash";
import { setDarkMode } from "@/store/sysSlice";
import { useAppDispatch } from "@/store/hooks";

function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const isLogin = !isEmpty(cookies.get("UAT"));

  return (
    <header className="absolute top-0 w-full h-[50px] bg-[var(--card-bg-color)] dark:bg-[var(--background)] shadow-sm sm:flex items-center p-2">
      <nav className="flex justify-between items-center w-full md:max-w-[1200px]">
        <div className="flex justify-center items-center w-full sm:w-auto">
          <Link className="flex justify-center items-center" href="/">
            <Image
              src="/icons/fire_icon.png"
              alt="logo"
              width={30}
              height={30}
              priority
            />
            <h4 className="ml-2">FireMessage</h4>
          </Link>
        </div>
        {isLogin && (
          <div className="items-center gap-4 hidden sm:flex">
            <button
              type="button"
              className="relative text-gray-400 hover:text-[var(--active)]"
              aria-label="切換深色模式"
              onClick={() => dispatch(setDarkMode())}
            >
              <FontAwesomeIcon
                icon={faSun}
                size="lg"
                className="h-5 w-5 translate-y-0 opacity-100 transform duration-300 ease-linear dark:translate-y-5 dark:opacity-0"
              />
              <FontAwesomeIcon
                icon={faMoon}
                size="lg"
                className="absolute h-5 w-5 top-[2px] left-0 translate-y-5 opacity-0 transform duration-300 ease-linear dark:translate-y-0 dark:opacity-100"
              />
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-[var(--active)]"
              aria-label="通知"
            >
              <FontAwesomeIcon icon={faBell} size="lg" />
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-[var(--active)]"
              aria-label="登出"
              onClick={async () => {
                const res = (await logout()) as authResponseType;
                if (res.code === "SUCCESS") {
                  router.push("/login");
                }
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
            </button>
            <Link
              href="/userProfile"
              className="hidden sm:block px-4 py-2 hover:text-gray-300"
            >
              User Profile
            </Link>
            <button
              type="button"
              className="text-gray-400 hover:text-[var(--active)] sm:hidden"
              aria-label="功能選單"
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
