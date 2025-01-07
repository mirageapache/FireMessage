"use client";

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faMessage, faBell,
} from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { useSelector } from "react-redux";
import { RootState } from '@/store';
import Avatar from './Avatar';
import NotifyTip from './NotifyTip';

function BottomNavbar() {
  const userData = useSelector((state: RootState) => state.auth.user);

  return (
    <nav className="fixed bottom-0 flex justify-between items-center w-full h-[50px] p-5 sm:hidden">
      <Link href="/" className="flex justify-center w-full">
        <FontAwesomeIcon icon={faHome} size="lg" />
      </Link>
      <Link href="/message" className="relative flex justify-center w-full">
        <FontAwesomeIcon icon={faMessage} size="lg" />
        <NotifyTip amount={1111} />
      </Link>
      <Link href="/notification" className="relative flex justify-center w-full">
        <FontAwesomeIcon icon={faBell} size="lg" />
        <NotifyTip amount={11} />
      </Link>
      <Link href="/profile" className="flex justify-center w-full">
        <Avatar
          avatarUrl={userData!.photoURL}
          userName={userData!.displayName}
          size="w-8 h-8"
          textSize="text-md"
          bgColor="#3b82f6"
        />
      </Link>
    </nav>
  );
}

export default BottomNavbar;
