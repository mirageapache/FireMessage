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
    <div className="flex justify-between items-center w-full hover:bg-gray-700 cursor-pointer px-3 py-2 rounded-lg">
      <div>
        <Avatar
          userName={userName}
          avatarUrl={avatarUrl}
          size="w-10 h-10"
          textSize="text-sm"
          bgColor="#3b82f6"
        />
      </div>
      <div className="w-full px-2">
        <p>{userName}</p>
        <p className="text-gray-500 text-sm line-clamp-1">{lastMessage}</p>
      </div>
      <div className="relative flex flex-col gap-2 justify-space items-end h-[50px]">
        <p className="top-0 right-0 text-gray-300 text-xs">{lastMessageTime}</p>
        <p className="bg-orange-500 text-white rounded-full px-2 text-sm">
          {unreadCount}
        </p>
      </div>
    </div>
  );
}

export default ChatItem;
