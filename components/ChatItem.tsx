"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setActiveChatRoom } from "@/store/chatSlice";
import { useAppSelector } from "@/store/hooks";
import { cn, formatDateTime } from "@/lib/utils";
import { updateReadStatus } from "@/lib/chat";
import Avatar from "./Avatar";

interface ChatItemProps {
  chatRoomId: string;
  members: string[];
  chatRoomName: string;
  avatarUrl: string;
  bgColor: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  showCount: boolean;
  type: number;
  isChatList?: boolean; // 判斷是否為聊天室列表
}

function ChatItem({
  chatRoomId,
  members,
  chatRoomName,
  avatarUrl,
  bgColor,
  lastMessage,
  lastMessageTime,
  unreadCount,
  showCount,
  type,
  isChatList = false,
}: ChatItemProps) {
  const dispatch = useDispatch();
  const uid = useAppSelector((state) => state.user.userData?.uid);
  const [linkUrl, setLinkUrl] = useState("/chat");

  useEffect(() => {
    const handleResize = () => {
      setLinkUrl(window.innerWidth < 768 ? "/chatRoom" : "/chat");
    };

    handleResize();
    // 監聽視窗大小變化，調整聊天室顯示路徑
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Link
      href={linkUrl}
      className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] cursor-pointer px-2 py-2 rounded-lg"
      onClick={async () => {
        if (unreadCount > 0) {
          await updateReadStatus(chatRoomId, uid!);
        }
        dispatch(setActiveChatRoom({
          chatRoom: {
            chatRoomId,
            chatRoomName,
            members,
            type,
            avatarUrl,
            bgColor,
            lastMessage,
            lastMessageTime,
            createdAt: "",
            unreadCount: 0,
            lastIndexTime: '',
            hasMore: false,
          },
        }));
      }}
    >
      <div className="flex justify-start items-center w-full">
        <div className="w-10 h-10">
          <Avatar
            userName={chatRoomName}
            avatarUrl={avatarUrl}
            classname="w-10 h-10 max-w-10 max-h-10"
            textSize="text-md"
            bgColor={bgColor}
          />
        </div>
        <div className={cn("w-full px-2 leading-5", isChatList && "md:max-w-[95px] lg:max-w-[170px]")}>
          <p className="w-full truncate">{chatRoomName}</p>
          <p className="text-[var(--secondary-text-color)] text-sm line-clamp-1">{lastMessage}</p>
        </div>
      </div>
      <div className="relative flex flex-col gap-2 justify-space items-end h-[50px]">
        {lastMessage.length > 0 && (
          <p className="top-0 right-0 w-auto text-[var(--secondary-text-color)] text-xs text-right truncate">{formatDateTime(lastMessageTime)}</p>
        )}
        {showCount && unreadCount > 0 && (
          <p className="bg-orange-500 text-white rounded-full px-2 text-sm">
            {unreadCount}
          </p>
        )}
      </div>
    </Link>
  );
}

export default ChatItem;
