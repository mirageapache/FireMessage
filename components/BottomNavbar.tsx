"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMessage,
  faBell,
  faXmark,
  faRightFromBracket,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setDarkMode } from "@/store/sysSlice";
import { cn } from "@/lib/utils";
import { authResponseType } from "@/types/authType";
import { logout } from "@/lib/auth";
import Avatar from "./Avatar";
import NotifyTip from "./NotifyTip";
import { Button } from "./ui/button";

function BottomNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user.userData);
  const dispatch = useAppDispatch();
  const path = usePathname();
  const currentPath = path?.slice(1);
  const basicItemStyle = "flex justify-center w-full";

  // 監聽螢幕 resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // 清理監聽
  }, [isOpen]);

  return (
    <nav className="fixed bottom-0 flex justify-between items-center w-full h-[50px] p-5 sm:hidden bg-[var(--background)] z-50">
      <Link
        href="/dashboard"
        className={cn(currentPath === "dashboard" && "activeItem", basicItemStyle)}
      >
        <FontAwesomeIcon icon={faHome} size="lg" />
      </Link>
      <Link
        href="/chat"
        aria-label="聊天"
        className={cn(currentPath === "chat" && "activeItem", basicItemStyle, "relative")}
      >
        <FontAwesomeIcon icon={faMessage} size="lg" />
        <NotifyTip amount={1111} />
      </Link>
      <Link
        href="/notification"
        aria-label="通知"
        className={cn(currentPath === "notification" && "activeItem", basicItemStyle, "relative")}
      >
        <FontAwesomeIcon icon={faBell} size="lg" />
        <NotifyTip amount={11} />
      </Link>
      <button aria-label="使用者選單" type="button" onClick={() => setIsOpen(true)} className={cn(basicItemStyle)}>
        <Avatar
          avatarUrl={userData?.avatarUrl || ""}
          userName={userData?.userName || ""}
          classname="w-8 h-8"
          textSize="text-md"
          bgColor={userData?.bgColor || ""}
        />
      </button>

      {/* 使用者選單 */}
      <div className={cn(
        "fixed bottom-0 left-0 w-full h-full p-8 bg-black/90",
        "transform duration-200 ease-linear",
        isOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-[-100%] opacity-0",
      )}
      >
        <Button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 text-gray-300 hover:text-gray-400 cursor-pointer"
        >
          <FontAwesomeIcon icon={faXmark} className="w-8 h-8" />
        </Button>
        <nav className="flex flex-col justify-between text-white h-full pt-12 z-50">
          <div className="flex flex-col gap-6 text-3xl">
            <Link href={`/profile/${userData?.uid}`} className="hover:text-[var(--active)]" onClick={() => setIsOpen(false)}>個人資料</Link>
            <Link href="/friend" className="hover:text-[var(--active)]" onClick={() => setIsOpen(false)}>好友</Link>
            <Link href="/search" className="hover:text-[var(--active)]" onClick={() => setIsOpen(false)}>搜尋</Link>
            <Link href="/setting" className="hover:text-[var(--active)]" onClick={() => setIsOpen(false)}>設定</Link>
          </div>
          <div className="flex justify-between items-center">
            <button
              aria-label="深色模式切換"
              type="button"
              className="w-14 h-7 flex justify-start items-center border border-gray-400 rounded-full px-2 bg-gray-800"
              onClick={() => {
                dispatch(setDarkMode());
              }}
            >
              <FontAwesomeIcon
                icon={faSun}
                size="lg"
                className="h-5 w-5 text-orange-500 translate-x-0 opacity-100 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-0"
              />
              <FontAwesomeIcon
                icon={faMoon}
                size="lg"
                className="absolute h-5 w-5 text-yellow-600 translate-x-0 opacity-0 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-100"
              />
            </button>
            <button
              type="button"
              aria-label="登出"
              onClick={async () => {
                setIsOpen(false);
                const res = (await logout()) as authResponseType;
                if (res.code === "SUCCESS") router.push("/login");
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} size="lg" className="w-6 h-6 hover:text-gray-400" />
            </button>
          </div>
        </nav>
      </div>
    </nav>
  );
}

export default BottomNavbar;
