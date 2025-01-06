"use client";

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faMessage, faBell, faUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { useSelector } from "react-redux";
import { RootState } from '@/store';
import Avatar from './Avatar';
import NotifyTip from './NotifyTip';

function BottomNavbar() {
  const userData = useSelector((state: RootState) => state.auth.user);

  return (
    <nav className="flex justify-between items-center w-full h-[50px] p-5 sm:hidden">
      <Link href="/">
        <FontAwesomeIcon icon={faHome} size="2x" />
      </Link>
      <Link href="/message" className="relative">
        <FontAwesomeIcon icon={faMessage} size="2x" />
        <NotifyTip amount={1001} />
      </Link>
      <Link href="/notification" className="relative">
        <FontAwesomeIcon icon={faBell} size="2x" />
        <NotifyTip amount={10} />
      </Link>
      <Link href="/profile">
        {userData
          ? (
            <Avatar
              avatarUrl={userData.photoURL}
              userName={userData.displayName}
              size="w-8 h-8"
              textSize="text-md"
              bgColor="bg-gray-500"
            />
          )
          : <FontAwesomeIcon icon={faUser} size="2x" />}
      </Link>
    </nav>
  );
}

export default BottomNavbar;
