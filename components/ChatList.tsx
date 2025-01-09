"use client";

import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";

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
        <div className="flex justify-between items-center hover:bg-gray-600 cursor-pointer p-2">
          <div>
            <Avatar
              userName="Test"
              avatarUrl=""
              size="w-10 h-10"
              textSize="text-sm"
              bgColor="#3b82f6"
            />
          </div>
          <div className="w-full px-2 text-sm">
            <p>好友名稱</p>
            <p className="text-gray-500 line-clamp-1">
              最後訊息最後訊息最後訊息最後訊息最後訊息 最後訊息 最後訊息
            </p>
          </div>
          <div className="relative flex flex-col gap-1 justify-between items-end h-[50px]">
            <p className="top-0 right-0 text-gray-300 text-xs">12:00</p>
            <p className="bg-orange-500 text-white rounded-full px-2 text-sm">
              2
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatList;
