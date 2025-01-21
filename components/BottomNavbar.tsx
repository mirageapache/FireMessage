"use client";

import React, { useState } from "react";
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

  return (
    <nav className="fixed bottom-0 flex justify-between items-center w-full h-[50px] p-5 sm:hidden bg-[var(--background)]">
      <Link
        href="/dashboard"
        className={cn(currentPath === "dashboard" && "activeItem", basicItemStyle)}
      >
        <FontAwesomeIcon icon={faHome} size="lg" />
      </Link>
      <Link
        href="/chat"
        className={cn(currentPath === "chat" && "activeItem", basicItemStyle, "relative")}
      >
        <FontAwesomeIcon icon={faMessage} size="lg" />
        <NotifyTip amount={1111} />
      </Link>
      <Link
        href="/notification"
        className={cn(currentPath === "notification" && "activeItem", basicItemStyle, "relative")}
      >
        <FontAwesomeIcon icon={faBell} size="lg" />
        <NotifyTip amount={11} />
      </Link>
      <Button onClick={() => setIsOpen(true)} className={cn(basicItemStyle)}>
        <Avatar
          avatarUrl={userData?.avatarUrl || ""}
          userName={userData?.userName || ""}
          size="w-8 h-8"
          textSize="text-md"
          bgColor={userData?.bgColor || ""}
        />
      </Button>
      {isOpen && (
        <div className="fixed bottom-0 left-0 w-full h-full p-8 bg-black/90">
          <Button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-gray-300 hover:text-gray-400 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="w-8 h-8" />
          </Button>
          <nav className="flex flex-col justify-between h-full pt-12">
            <div className="flex flex-col gap-4 text-2xl">
              <Link href="/profile" className="hover:text-[var(--active)]">個人資料</Link>
              <Link href="/setting" className="hover:text-[var(--active)]">設定</Link>
            </div>
            <div className="flex justify-between">
              <button
                aria-label="darkMode"
                type="button"
                className="w-14 h-7 flex justify-start items-center border border-gray-400 rounded-full px-2 bg-gray-800"
                onClick={() => {
                  dispatch(setDarkMode());
                }}
              >
                <FontAwesomeIcon
                  icon={faSun}
                  size="lg"
                  className="h-5 w-5 text-white translate-x-0 opacity-100 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-0"
                />
                <FontAwesomeIcon
                  icon={faMoon}
                  size="lg"
                  className="absolute h-5 w-5 text-white translate-x-0 opacity-0 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-100"
                />
              </button>

              <Button onClick={async () => {
                const res = (await logout()) as authResponseType;
                if (res.code === "SUCCESS") {
                  router.push("/login");
                }
              }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
              </Button>
            </div>
          </nav>
        </div>
      )}
    </nav>
  );
}

export default BottomNavbar;
