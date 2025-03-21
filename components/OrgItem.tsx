"use client";

import { setActiveChatRoom } from "@/store/chatSlice";
import { useAppDispatch } from "@/store/hooks";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";

function OrgItem({
  members,
  chatRoomId,
  organizationName,
  avatarUrl,
  bgColor,
}: {
  members: string[];
  chatRoomId: string;
  organizationName: string;
  avatarUrl: string;
  bgColor: string;
}) {
  const dispatch = useAppDispatch();
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
      className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] cursor-pointer px-3 py-2 rounded-lg"
      onClick={() => {
        if (chatRoomId) {
          dispatch(setActiveChatRoom({
            chatRoom: {
              chatRoomId,
              chatRoomName: organizationName,
              members,
              type: 1,
              avatarUrl,
              bgColor,
              lastMessage: "",
              lastMessageTime: "",
              createdAt: "",
              unreadCount: 0,
            },
          }));
        }
      }}
    >
      <div>
        <Avatar
          userName={organizationName}
          avatarUrl={avatarUrl}
          classname="w-10 h-10 max-w-10 max-h-10"
          textSize="text-sm"
          bgColor={bgColor}
        />
      </div>
      <div className="w-full px-2">
        <p>{organizationName}</p>
      </div>
    </Link>
  );
}

export default OrgItem;
