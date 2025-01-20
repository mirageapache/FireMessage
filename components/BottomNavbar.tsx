"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMessage,
  faBell,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { cn } from "@/lib/utils";
import { authResponseType } from "@/types/authType";
import { logout } from "@/lib/auth";
import Avatar from "./Avatar";
import NotifyTip from "./NotifyTip";
import { Button } from "./ui/button";

function BottomNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.auth.user);
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
        <div className="fixed bottom-0 left-0 w-full h-full p-8 bg-black/80">
          <Button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-gray-300 hover:text-gray-400 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="w-8 h-8" />
          </Button>
          <nav className="flex flex-col justify-between h-full pt-12">
            <div className="flex flex-col gap-4 text-2xl">
              <Link href="/profile">個人資料</Link>
              <Link href="/setting">設定</Link>
            </div>
            <div>
              <Button>darkmode</Button>
              <Button onClick={async () => {
                const res = (await logout()) as authResponseType;
                if (res.code === "SUCCESS") {
                  router.push("/login");
                }
              }}
              >
                logout
              </Button>
            </div>
          </nav>
        </div>
      )}
    </nav>
  );
}

export default BottomNavbar;
