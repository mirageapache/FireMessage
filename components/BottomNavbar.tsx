"use client";

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faMessage, faBell,
} from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from "react-redux";
import { RootState } from '@/store';
import { cn } from '@/lib/utils';
import Avatar from './Avatar';
import NotifyTip from './NotifyTip';

function BottomNavbar() {
  const userData = useSelector((state: RootState) => state.auth.user);
  const path = usePathname();
  const currentPath = path?.slice(1);
  const basicItemStyle = "flex justify-center w-full";

  return (
    <nav className="fixed bottom-0 flex justify-between items-center w-full h-[50px] p-5 sm:hidden bg-[var(--background)]">
      <Link href="/dashboard" className={cn(currentPath === 'dashboard' && "activeItem", basicItemStyle)}>
        <FontAwesomeIcon icon={faHome} size="lg" />
      </Link>
      <Link href="/chat" className={cn(currentPath === 'chat' && "activeItem", basicItemStyle, "relative")}>
        <FontAwesomeIcon icon={faMessage} size="lg" />
        <NotifyTip amount={1111} />
      </Link>
      <Link href="/notification" className={cn(currentPath === 'notification' && "activeItem", basicItemStyle, "relative")}>
        <FontAwesomeIcon icon={faBell} size="lg" />
        <NotifyTip amount={11} />
      </Link>
      <Link href="/profile" className={cn(basicItemStyle)}>
        <Avatar
          avatarUrl={userData!.avatarUrl}
          userName={userData!.userName}
          size="w-8 h-8"
          textSize="text-md"
          bgColor="#3b82f6"
        />
      </Link>
    </nav>
  );
}

export default BottomNavbar;
