"use client";

import React, { useEffect, useState } from "react";
import { friendDataType } from "@/types/friendType";
import { useAppSelector } from "@/store/hooks";
import ChatItem from "./ChatItem";
import UserItem from "./UserItem";

function ChatList() {
  const FriendListData = useAppSelector((state) => state.friend.friendList);
  const [activeTab, setActiveTab] = useState("chat");
  const [activeUnderLine, setActiveUnderLine] = useState(""); // 頁籤樣式控制
  const [friendList, setFriendList] = useState<friendDataType[]>([]);

  useEffect(() => {
    setFriendList(FriendListData!);
  }, [FriendListData]);

  useEffect(() => {
    switch (activeTab) {
      case "chat":
        setActiveUnderLine("translate-x-0");
        break;
      case "friend":
        setActiveUnderLine("translate-x-full");
        break;
      case "group":
        setActiveUnderLine("translate-x-[200%]");
        break;
      default:
        setActiveUnderLine("translate-x-0");
    }
  }, [activeTab]);

  return (
    <>
      <div>
        <div className="flex justify-center items-center">
          <button
            type="button"
            className="w-full text-center p-2"
            onClick={() => setActiveTab("chat")}
          >
            聊天
          </button>
          <button
            type="button"
            className="w-full text-center p-2"
            onClick={() => setActiveTab("friend")}
          >
            好友
          </button>
          <button
            type="button"
            className="w-full text-center p-2"
            onClick={() => setActiveTab("group")}
          >
            群組
          </button>
        </div>
        <div className="flex justify-start -translate-y-0.5">
          <span
            className={`border-b-[2px] border-orange-500 w-1/3 text-transparent ${activeUnderLine} transform duration-300 ease-in-out`}
          />
        </div>
      </div>
      <div className="my-2">
        <input
          type="text"
          placeholder="搜尋"
          className="formInput w-full p-1 rounded-lg pl-3"
        />
      </div>
      <div>
        {/* 聊天室 */}
        {activeTab === "chat" && (
          <ChatItem
            userName="Test"
            avatarUrl=""
            lastMessage="Test"
            lastMessageTime="12:00"
            unreadCount={2}
          />
        )}
        {/* 好友 */}
        {activeTab === "friend" && (
          <div>
            {friendList!.map((item) => (
              <UserItem
                key={item.uid}
                uid={item.uid}
                userName={item.userName}
                userAccount={item.userAccount}
                avatarUrl={item.avatarUrl}
                bgColor={item.bgColor}
                chatRoomId={item.chatRoomId}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ChatList;
