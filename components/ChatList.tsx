"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "lodash";
import { friendDataType } from "@/types/friendType";
import { chatListInfoType } from "@/types/chatType";
import { useAppSelector } from "@/store/hooks";
import { organizationDataType } from "@/types/organizationType";
import ChatItem from "./ChatItem";
import UserItem from "./UserItem";
import OrgItem from "./OrgItem";

function ChatList({ handleGetChatList }: { handleGetChatList: () => void }) {
  const uid = useAppSelector((state) => state.user.userData?.uid);
  const FriendListData = useAppSelector((state) => state.friend.friendList);
  const chatListData = useAppSelector((state) => state.chat.chatList);
  const organizationListData = useAppSelector(
    (state) => state.organization.organizationList,
  );
  const [activeTab, setActiveTab] = useState("chat");
  const [activeUnderLine, setActiveUnderLine] = useState(""); // 頁籤樣式控制
  const [chatList, setChatList] = useState<chatListInfoType[]>([]);
  const [friendList, setFriendList] = useState<friendDataType[]>([]);
  const [orgList, setOrgList] = useState<organizationDataType[]>([]);
  const [searchValue, setSearchValue] = useState("");

  /** 處理搜尋功能 */
  const handleSearch = (value: string) => {
    setChatList(chatListData!.filter((item) => item.chatRoomName.includes(value)));
    setFriendList(FriendListData!.filter((item) => item.sourceUserData.userName.includes(value)));
    setOrgList(organizationListData!.filter((item) => item.organizationName.includes(value)));
  };

  useEffect(() => {
    setChatList(chatListData!);
    if (uid && isEmpty(chatListData)) handleGetChatList();
  }, [uid, chatListData]);

  useEffect(() => {
    setFriendList(FriendListData!);
  }, [FriendListData]);

  useEffect(() => {
    setOrgList(organizationListData!);
  }, [organizationListData]);

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
      <div className="relative my-2">
        <input
          type="text"
          placeholder="搜尋"
          className="formInput w-full p-1 rounded-lg pl-3"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        {searchValue.length > 0 && (
          <button
            type="button"
            className="absolute right-2 top-0 h-full px-2 text-[var(--disable)] hover:text-[var(--active)]"
            onClick={() => {
              setSearchValue("");
              handleSearch("");
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
      </div>
      <div>
        {/* 聊天室 */}
        {activeTab === "chat" && (
          <div>
            {chatList?.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="mt-4 text-lg text-[var(--secondary-text-color)]">
                  {searchValue.length > 0 ? "-找不到聊天紀錄-" : "-尚無聊天紀錄-"}
                </p>
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
                  type={item.type}
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
                <p className="mt-4 text-lg text-[var(--secondary-text-color)]">
                  {searchValue.length > 0 ? "-找不到好友-" : "-尚無好友資料-"}
                </p>
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

        {/* 群組 */}
        {activeTab === "group" && (
          <div className="relative">
            {orgList?.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="mt-4 text-lg text-[var(--secondary-text-color)]">
                  {searchValue.length > 0 ? "-找不到群組-" : "-尚無群組資料-"}
                </p>
              </div>
            ) : (
              orgList!.map((item) => (
                <OrgItem
                  key={item.orgId}
                  chatRoomId={item.chatRoomId}
                  members={item.members}
                  organizationName={item.organizationName}
                  avatarUrl={item.avatarUrl}
                  bgColor={item.bgColor}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ChatList;
