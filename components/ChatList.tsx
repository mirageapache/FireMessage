"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { friendDataType } from "@/types/friendType";
import { chatListInfoType } from "@/types/chatType";
import { useAppSelector } from "@/store/hooks";
import { getChatList } from "@/lib/chat";
import ChatItem from "./ChatItem";
import UserItem from "./UserItem";
import Spinner from "./Spinner";

function ChatList() {
  const uid = useAppSelector((state) => state.user.userData?.uid);
  const FriendListData = useAppSelector((state) => state.friend.friendList);
  const chatListData = useAppSelector((state) => state.chat.chatList);
  const [activeTab, setActiveTab] = useState("chat");
  const [activeUnderLine, setActiveUnderLine] = useState(""); // 頁籤樣式控制
  const [friendList, setFriendList] = useState<friendDataType[]>([]);
  const [chatList, setChatList] = useState<chatListInfoType[]>([]);
  const [loading, setLoading] = useState(true);

  /** 取得聊天室列表資料 */
  const handleGetChatList = async () => {
    if (!uid) return;
    setLoading(true);
    const result = await getChatList(uid!);
    if (result.code === "success") {
      setChatList(result.chatList as unknown as chatListInfoType[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setFriendList(FriendListData!);
    setChatList(chatListData!);
    if (uid && isEmpty(chatListData)) handleGetChatList();
  }, [FriendListData, chatListData]);

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
        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* 聊天室 */}
            {activeTab === "chat" && (
              <div>
                {chatList?.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="mt-4 text-lg text-[var(--secondary-text-color)]"> -尚無聊天紀錄-</p>
                  </div>
                ) : (
                  chatList?.map((item) => (
                    <ChatItem
                      key={item.chatRoomId}
                      chatRoomId={item.chatRoomId}
                      members={item.members}
                      chatRoomName={item.chatRoomName}
                      avatarUrl={item.avatarUrl}
                      bgColor={item.bgColor}
                      lastMessage={item.lastMessage}
                      lastMessageTime={item.lastMessageTime}
                      unreadCount={item.unreadCount}
                      showCount={item.unreadCount > 0}
                    />
                  ))
                )}
              </div>
            )}
            {/* 好友 */}
            {activeTab === "friend" && (
              <div>
                {friendList?.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="mt-4 text-lg text-[var(--secondary-text-color)]"> -尚無好友資料-</p>
                  </div>
                ) : (
                  friendList!.map((item) => (
                    <UserItem
                      key={item.uid}
                      uid={item.uid}
                      userName={item.sourceUserData.userName}
                      userAccount={item.sourceUserData.userAccount}
                      avatarUrl={item.sourceUserData.avatarUrl}
                      bgColor={item.sourceUserData.bgColor}
                      chatRoomId={item.chatRoomId}
                      status={item.status}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ChatList;
