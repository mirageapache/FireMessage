"use client";

import React, { useEffect, useState } from "react";
import ChatItem from "@/components/ChatItem";
import ProfileCard from "@/components/ProfileCard";
import UserItem from "@/components/UserItem";
import { checkNewFriend, getFriendList } from "@/lib/friend";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { friendDataType, friendResponseType } from "@/types/friendType";
import { chatListInfoType } from "@/types/chatType";

function Dashboard() {
  const sectionStyle = "flex flex-col justify-center items-center h-fit py-4 px-4 bg-[var(--card-bg-color)] rounded-lg";
  const userData = useAppSelector((state) => state.user.userData);
  const friendList = useAppSelector((state) => state.friend.friendList);
  const newFriendList = checkNewFriend(friendList);
  const chatList = useAppSelector((state) => state.chat.chatList);
  const [recentChatList, setRecentChatList] = useState<chatListInfoType[]>([]);
  const [friendRequestList, setFriendRequestList] = useState<friendDataType[]>([]);

  /** 取得好友邀請 */
  const handleGetFriendRequestList = async () => {
    const result = await getFriendList(userData?.uid || "", 2) as friendResponseType;
    if (result.code === "SUCCESS") {
      setFriendRequestList(result.data);
    }
  };

  useEffect(() => {
    setRecentChatList(chatList?.slice(0, 3) || []);
  }, [chatList]);

  useEffect(() => {
    handleGetFriendRequestList();
  }, []);

  return (
    <div className="w-full p-5">
      <section className={cn(sectionStyle, "mb-5 px-6")}>
        <ProfileCard />
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 content-start w-full">
        {friendRequestList.length > 0 && (
          <section>
            <h4 className="text-left mb-2">好友邀請</h4>
            <div className={sectionStyle}>
              {friendRequestList.map((friend) => (
                <UserItem
                  key={friend.uid}
                  uid={friend.uid}
                  userName={friend.sourceUserData.userName}
                  avatarUrl={friend.sourceUserData.avatarUrl}
                  userAccount=""
                  bgColor={friend.sourceUserData.bgColor}
                  status={5}
                  chatRoomId={friend.chatRoomId}
                />
              ))}
            </div>
          </section>
        )}

        {newFriendList.length > 0 && (
          <section>
            <h4 className="text-left mb-2">最新好友</h4>
            <div className={sectionStyle}>
              {newFriendList.map((friend) => (
                <UserItem
                  key={friend.uid}
                  uid={friend.uid}
                  userName={friend.sourceUserData.userName}
                  avatarUrl={friend.sourceUserData.avatarUrl}
                  userAccount=""
                  bgColor={friend.sourceUserData.bgColor}
                  status={5}
                  chatRoomId={friend.chatRoomId}
                />
              ))}
            </div>
          </section>
        )}

        {(recentChatList && recentChatList.length > 0) && (
          <section>
            <h4 className="text-left mb-2">近期訊息</h4>
            <div className={sectionStyle}>
              {recentChatList.map((item) => (
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
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
