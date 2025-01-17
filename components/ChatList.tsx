"use client";

import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";

function ChatList() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeUnderLine, setActiveUnderLine] = useState(""); // 頁籤樣式控制

  useEffect(() => {
    switch (activeTab) {
      case "all":
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
            onClick={() => setActiveTab("all")}
          >
            全部
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
          className="w-full p-1 rounded-md"
        />
      </div>
      <div>
        <ChatItem
          userName="Test"
          avatarUrl=""
          lastMessage="Test"
          lastMessageTime="12:00"
          unreadCount={2}
        />
      </div>
    </>
  );
}

export default ChatList;
