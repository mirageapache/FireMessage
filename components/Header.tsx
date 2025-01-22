"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "@/lib/auth";
import { authResponseType } from "@/types/authType";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import { isEmpty } from "lodash";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { setDarkMode } from "@/store/sysSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Avatar from "./Avatar";

function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const [showDropdown, setShowDropdown] = useState(false);
  const isLogin = !isEmpty(cookies.get("UAT"));
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const navItemStyle = "rounded-full p-[5px]";
  const navItemHoverStyle = " hover:bg-gray-200 dark:hover:bg-gray-600";
  const dropdownItemStyle = "text-left hover:text-[var(--active)] hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg";

  // 監聽螢幕 resize
  useEffect(() => {
    const handleResize = () => {
      if (showDropdown) setShowDropdown(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // 清理監聽
  }, [showDropdown]);

  return (
    <header className="fixed top-0 left-0 w-screen h-[50px] bg-[var(--card-bg-color)] dark:bg-[var(--background)] shadow-sm sm:flex justify-center items-center py-2 px-5">
      <nav className="relative flex justify-between items-center w-full md:max-w-[1200px]">
        <div className="flex justify-center items-center w-full sm:w-auto">
          <Link className="flex justify-center items-center" href={isLogin ? "/dashboard" : "/"}>
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
          <>
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                className={cn(navItemStyle, navItemHoverStyle, "w-9 h-9 mt-[2px] relative text-gray-400 flex justify-center items-center")}
                aria-label="切換深色模式"
                onClick={() => dispatch(setDarkMode())}
              >
                <FontAwesomeIcon
                  icon={faSun}
                  size="lg"
                  className="h-[21px] w-[21px] text-orange-500 translate-y-0 opacity-100 transform duration-300 ease-linear dark:translate-y-5 dark:opacity-0"
                />
                <FontAwesomeIcon
                  icon={faMoon}
                  size="lg"
                  className="absolute h-[21px] w-[21px] text-yellow-600 translate-y-5 opacity-0 transform duration-300 ease-linear dark:translate-y-0 dark:opacity-100"
                />
              </button>
              <button
                type="button"
                className={cn(navItemStyle, navItemHoverStyle, "w-9 h-9 mr-1 text-gray-400 hover:text-[var(--active)]")}
                aria-label="通知"
              >
                <FontAwesomeIcon icon={faBell} size="lg" />
              </button>
              <button
                aria-label="使用者選單"
                type="button"
                className={cn(navItemStyle, navItemHoverStyle, "hidden sm:flex justify-center items-center mt-[2px]")}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Avatar
                  userName={userData?.userName || ""}
                  avatarUrl={userData?.avatarUrl || ""}
                  classname="w-[26px] h-[26px]"
                  textSize="text-md"
                  bgColor={userData?.bgColor || ""}
                />
              </button>
            </div>

            {/* 使用者選單 */}
            {showDropdown && (
              <div className="w-[250px] absolute top-[50px] right-3 border border-[var(--divider-color)] rounded-lg bg-[var(--card-bg-color)] p-3 shadow-lg z-20">
                <Link
                  href="/profile"
                  className={cn(dropdownItemStyle, "flex justify-start items-center gap-2 px-2 hover:text-[var(--text-color)]")}
                  onClick={() => setShowDropdown(false)}
                >
                  <Avatar
                    userName={userData?.userName || ""}
                    avatarUrl={userData?.avatarUrl || ""}
                    classname="w-10 h-10"
                    textSize="text-md"
                    bgColor={userData?.bgColor || ""}
                  />
                  <span className="leading-5">
                    <p>{userData?.userName}</p>
                    <p className="text-[13px]">{userData?.email}</p>
                  </span>
                </Link>
                <div className="flex flex-col border-y border-[var(--divider-color)] my-3 py-3">
                  <Link href="/friend" className={cn(dropdownItemStyle)} onClick={() => setShowDropdown(false)}>好友</Link>
                  <Link href="/setting" className={cn(dropdownItemStyle)} onClick={() => setShowDropdown(false)}>設定</Link>
                </div>
                <div>
                  <button
                    type="button"
                    className={cn(dropdownItemStyle, "w-full")}
                    aria-label="登出"
                    onClick={async () => {
                      setShowDropdown(false);
                      const res = (await logout()) as authResponseType;
                      if (res.code === "SUCCESS") {
                        router.push("/login");
                      }
                    }}
                  >
                    登出
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </nav>
      {showDropdown
        && (
          <button aria-label="關閉使用者選單" type="button" className="fixed top-[50px] left-0 w-screen h-[calc(100vh-50px)] z-10" onClick={() => setShowDropdown(false)} />
        )}
    </header>
  );
}

export default Header;
