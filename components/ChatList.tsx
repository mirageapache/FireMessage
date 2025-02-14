"use client";

import React, { useEffect, useState } from "react";
import { friendDataType } from "@/types/friendType";
import { getFriendList } from "@/lib/friend";
import { useAppSelector } from "@/store/hooks";
import ChatItem from "./ChatItem";
import UserItem from "./UserItem";

function ChatList() {
  const userData = useAppSelector((state) => state.user.userData);
  const [activeTab, setActiveTab] = useState("chatroom");
  const [activeUnderLine, setActiveUnderLine] = useState(""); // 頁籤樣式控制
  const [friendList, setFriendList] = useState<friendDataType[]>([]);

  /** 取得好友列表 */
  const handleGetFriendList = async () => {
    const result = await getFriendList(userData?.uid || "", 5) as unknown as friendDataType[];
    setFriendList(result);
  };

  useEffect(() => {
    handleGetFriendList();
  }, []);

  useEffect(() => {
    switch (activeTab) {
      case "chatroom":
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
            onClick={() => setActiveTab("chatroom")}
          >
            聊天室
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
          className="w-full p-1 rounded-lg"
        />
      </div>
      <div>
        {/* 聊天室 */}
        {activeTab === "chatroom" && (
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
            {friendList.map((item) => (
              <UserItem
                key={item.uid}
                uid={item.uid}
                userName={item.userName}
                userAccount={item.userAccount}
                avatarUrl={item.avatarUrl}
                bgColor={item.bgColor}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ChatList;
