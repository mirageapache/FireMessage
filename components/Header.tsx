"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faMessage,
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
import { useNotification } from "@/hooks/useNotification";
import { useMessage } from "@/hooks/useMessage";
import { RootState } from "@/store";
import { setDarkMode, setUnCheckedNotiCount, setUnReadMessageCount } from "@/store/sysSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFriendList } from "@/store/friendSlice";
import { setChatList } from "@/store/chatSlice";
import { updateUserSettings } from "@/lib/user";
import { getFriendList } from "@/lib/friend";
import { getChatList } from "@/lib/chat";
import { getNotification, updateNotificationIsChecked } from "@/lib/notification";
import { notificationDataType, notificationResponseType } from "@/types/notificationType";
import { friendResponseType } from "@/types/friendType";
import { chatListInfoType } from "@/types/chatType";
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
  const userSettings = useAppSelector((state: RootState) => state.system.userSettings);
  const activeChatRoomId = useAppSelector((state) => state.chat.activeChatRoom?.chatRoomId);
  const unReadMessageCount = useAppSelector((state) => state.system.unReadMessageCount);
  const navItemStyle = "w-9 h-9 rounded-full p-[5px] text-gray-400";
  const navItemHoverStyle = "hover:bg-gray-200 dark:hover:bg-gray-600";
  const dropdownItemStyle = "text-left hover:text-[var(--active)] hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg";
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState<notificationDataType[]>([]);
  const [unReadCount, setUnReadCount] = useState(0);

  /** 取得通知訊息 */
  const handleGetNotification = async () => {
    const res = await getNotification(userData?.uid || "", 10) as unknown as notificationResponseType;
    if (res.code === "SUCCESS") {
      setNotificationCount(res.unCheckedCount);
      setNotificationData(res.data);
      dispatch(setUnCheckedNotiCount(res.unCheckedCount));
    }
  };

  /** 取得聊天室列表資料 */
  const handleGetChatList = async () => {
    if (!userData?.uid) return;
    const result = await getChatList(userData?.uid || "");
    if (result.code === "SUCCESS") {
      dispatch(setChatList(result.chatList as unknown as chatListInfoType[]));

      if (isEmpty(result.chatList)) {
        setUnReadCount(0);
      } else {
        const count = result.chatList?.reduce((acc, item) => acc + item.unreadCount, 0) || 0;
        setUnReadCount(count);
        dispatch(setUnReadMessageCount(count));
      }
    }
  };

  /** 更新好友資料 */
  const handleUpdateFriend = async () => {
    const res = await getFriendList(userData?.uid || "", 5) as friendResponseType;
    if (res.code === "SUCCESS") {
      dispatch(setFriendList(res.data));
    }
  };

  /** 處理開啟通知行為 */
  const handleOpenNotification = async () => {
    const result = await updateNotificationIsChecked(userData?.uid || "");
    if (result.code === "SUCCESS") handleGetNotification();
    setShowNotificationModal(true);
  };

  // 監聽通知
  useNotification(userData?.uid || "", handleGetNotification, handleUpdateFriend);

  // 監聽即時訊息
  useMessage(userData?.uid || "", "header", activeChatRoomId || "", () => {}, handleGetChatList);

  // 取得通知及訊息未讀數
  useEffect(() => {
    if (isLogin) {
      handleGetNotification();
      handleGetChatList();
    }
  }, []);

  // 更新訊息未讀數
  useEffect(() => {
    setUnReadCount(unReadMessageCount);
  }, [unReadMessageCount]);

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
    <header className="fixed top-0 left-0 w-screen h-[50px] bg-[var(--card-bg-color)] dark:bg-gray-700 shadow-sm sm:flex justify-center items-center py-2 px-5 z-50">
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
                className={cn(navItemStyle, navItemHoverStyle, "relative flex justify-center items-center mt-[2px]")}
                onClick={() => router.push("/search")}
              >
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>

              {/* 深色模式 */}
              <button
                type="button"
                className={cn(navItemStyle, navItemHoverStyle, "relative flex justify-center items-center mt-[2px]")}
                aria-label="切換深色模式"
                onClick={() => {
                  dispatch(setDarkMode());
                  updateUserSettings(userData?.uid || "", {
                    ...userSettings,
                    darkMode: userSettings.darkMode === "dark" ? "" : "dark",
                  });
                }}
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

              {/* 聊天 */}
              <Link
                href="/chat"
                aria-label="聊天"
                className={cn(navItemStyle, navItemHoverStyle, "relative hover:text-[var(--active)]")}
              >
                <FontAwesomeIcon icon={faMessage} size="lg" className="w-[18px] h-[18px] ml-1 mt=[1px]" />
                <span className="absolute top-2 right-6">
                  <NotifyTip amount={unReadCount} />
                </span>
              </Link>

              {/* 通知 */}
              <button
                type="button"
                className={cn(navItemStyle, navItemHoverStyle, "relative mr-1 hover:text-[var(--active)]")}
                aria-label="通知"
                onClick={() => handleOpenNotification()}
              >
                <FontAwesomeIcon icon={faBell} size="lg" />
                <span className="absolute top-2 right-6">
                  <NotifyTip amount={notificationCount} />
                </span>
              </button>

              {/* 使用者選單 */}
              <button
                aria-label="使用者選單"
                type="button"
                className={cn(navItemStyle, navItemHoverStyle, "flex justify-center items-center mt-[2px]")}
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
                  <Link href="/organization" className={cn(dropdownItemStyle)} onClick={() => setShowDropdown(false)}>群組</Link>
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
