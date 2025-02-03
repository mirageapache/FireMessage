import React from "react";
import Avatar from "./Avatar";

interface ChatItemProps {
  userName: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

function ChatItem({
  userName,
  avatarUrl,
  lastMessage,
  lastMessageTime,
  unreadCount,
}: ChatItemProps) {
  return (
    <div className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] cursor-pointer px-3 py-2 rounded-lg">
      <div>
        <Avatar
          userName={userName}
          avatarUrl={avatarUrl}
          classname="w-10 h-10"
          textSize="text-md"
          bgColor="#3b82f6"
        />
      </div>
      <div className="w-full px-2 leading-5">
        <p>{userName}</p>
        <p className="text-[var(--secondary-text-color)] text-sm line-clamp-1">{lastMessage}</p>
      </div>
      <div className="relative flex flex-col gap-2 justify-space items-end h-[50px]">
        <p className="top-0 right-0 text-[var(--secondary-text-color)] text-xs">{lastMessageTime}</p>
        <p className="bg-orange-500 text-white rounded-full px-2 text-sm">
          {unreadCount}
        </p>
      </div>
    </div>
  );
}

export default ChatItem;
