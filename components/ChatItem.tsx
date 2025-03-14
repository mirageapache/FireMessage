import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setActiveChatRoom, setChatList } from "@/store/chatSlice";
import { formatDateTime } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { chatListInfoType } from "@/types/chatType";
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
}: ChatItemProps) {
  const chatList = useAppSelector((state) => state.chat.chatList);
  const dispatch = useDispatch();

  const updateChatList = () => {
    const updatedChatList = chatList?.map((item) => {
      if (item.chatRoomId === chatRoomId) {
        return { ...item, unreadCount: 0 };
      }
      return item;
    });
    dispatch(setChatList(updatedChatList as chatListInfoType[] | null));
  };

  return (
    <Link
      href="/chat"
      className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] cursor-pointer px-3 py-2 rounded-lg"
      onClick={() => {
        updateChatList();
        dispatch(setActiveChatRoom({
          chatRoom: {
            chatRoomId,
            chatRoomName,
            members,
            type: 0,
            avatarUrl,
            bgColor,
            lastMessage,
            lastMessageTime,
            createdAt: "",
            unreadCount: 0,
          },
        }));
      }}
    >
      <div className="w-10 h-10">
        <Avatar
          userName={chatRoomName}
          avatarUrl={avatarUrl}
          classname="w-10 h-10 max-w-10 max-h-10"
          textSize="text-md"
          bgColor={bgColor}
        />
      </div>
      <div className="w-full px-2 leading-5">
        <p>{chatRoomName}</p>
        <p className="text-[var(--secondary-text-color)] text-sm line-clamp-1">{lastMessage}</p>
      </div>
      <div className="relative flex flex-col gap-2 justify-space items-end h-[50px]">
        <p className="top-0 right-0 w-16 text-[var(--secondary-text-color)] text-xs text-right">{formatDateTime(lastMessageTime)}</p>
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
