"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faMoon,
  faSearch,
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
import { notificationDataType, notificationResponseType } from "@/types/notificationType";
import { getNotification } from "@/lib/notification";
import Avatar from "./Avatar";
import NotifyTip from "./NotifyTip";
import NotificationModal from "./NotificationModal";

function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const isLogin = !isEmpty(cookies.get("UAT"));
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const navItemStyle = "rounded-full p-[5px]";
  const navItemHoverStyle = "hover:bg-gray-200 dark:hover:bg-gray-600";
  const dropdownItemStyle = "text-left hover:text-[var(--active)] hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg";
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState<notificationDataType[]>([]);

  const handleGetNotification = async () => {
    const res = await getNotification(userData?.uid || "", 5) as unknown as notificationResponseType;
    if (res.code === "SUCCESS") {
      setNotificationCount(res.count);
      setNotificationData(res.data);
    }
  };

  useEffect(() => {
    if (isLogin) handleGetNotification();
  }, [userData?.uid, isLogin]);

  // 監聽螢幕 resize
  useEffect(() => {
    const handleResize = () => {
      if (showDropdown) setShowDropdown(false);
      if (showNotificationModal) setShowNotificationModal(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // 清理監聽
  }, [showDropdown, showNotificationModal]);

  return (
    <header className="fixed top-0 left-0 w-screen h-[50px] bg-[var(--card-bg-color)] dark:bg-[var(--background)] shadow-sm sm:flex justify-center items-center py-2 px-5 z-50">
      <nav className="relative flex justify-between items-center md:mr-4 w-full md:max-w-[1200px]">
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
              {/* 搜尋 */}
              <button
                type="button"
                aria-label="搜尋"
                className={cn(navItemStyle, navItemHoverStyle, "w-9 h-9 mt-[2px] relative text-gray-400 flex justify-center items-center")}
                onClick={() => router.push("/search")}
              >
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>

              {/* 深色模式 */}
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

              {/* 通知 */}
              <button
                type="button"
                className={cn(navItemStyle, navItemHoverStyle, "relative w-9 h-9 mr-1 text-gray-400 hover:text-[var(--active)]")}
                aria-label="通知"
                onClick={() => setShowNotificationModal(true)}
              >
                <FontAwesomeIcon icon={faBell} size="lg" />
                <span className="absolute top-2 right-6">
                  {notificationCount > 0 && <NotifyTip amount={notificationCount} /> }
                </span>
              </button>

              {/* 使用者選單 */}
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

            {/* 使用者下拉選單 */}
            {showDropdown && (
              <div className="w-[250px] absolute top-[50px] right-3 border border-[var(--divider-color)] rounded-lg bg-[var(--card-bg-color)] p-3 shadow-lg z-50">
                <Link
                  href={`/profile/${userData?.uid}`}
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

            {/* 通知彈窗 */}
            {showNotificationModal && (
              <div className="w-[450px] absolute top-[50px] right-12 border border-[var(--divider-color)] rounded-lg bg-[var(--card-bg-color)] p-5 shadow-lg z-50">
                <NotificationModal
                  data={notificationData}
                  setShowNotificationModal={setShowNotificationModal}
                />
              </div>
            )}
          </>
        )}
      </nav>
      {(showDropdown || showNotificationModal)
        && (
          <button
            aria-label="關閉選單"
            type="button"
            className="fixed top-0 left-0 w-screen h-screen cursor-default"
            onClick={() => {
              setShowDropdown(false);
              setShowNotificationModal(false);
            }}
          />
        )}
    </header>
  );
}

export default Header;
