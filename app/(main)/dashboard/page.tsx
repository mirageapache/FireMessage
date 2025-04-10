"use client";

import React, { useEffect, useState } from "react";
import ChatItem from "@/components/ChatItem";
import ProfileCard from "@/components/ProfileCard";
import UserItem from "@/components/UserItem";
import {
  checkNewFriend,
  getFriendList,
  getRecommendedFriends,
  getRecommendedNewFriend,
} from "@/lib/friend";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { friendDataType, friendResponseType } from "@/types/friendType";
import { chatRoomInfoType } from "@/types/chatType";

function Dashboard() {
  const sectionStyle = "flex flex-col justify-start items-center h-fit py-4 px-4 bg-[var(--card-bg-color)] rounded-lg";
  const userData = useAppSelector((state) => state.user.userData);
  const friendList = useAppSelector((state) => state.friend.friendList);
  const newFriendList = checkNewFriend(friendList);
  const chatList = useAppSelector((state) => state.chat.chatList);
  const [recentChatList, setRecentChatList] = useState<chatRoomInfoType[]>([]);
  const [friendRequestList, setFriendRequestList] = useState<friendDataType[]>([]);
  const [recommendedFriends, setRecommendedFriends] = useState<friendDataType[]>([]);
  const [recommendedNewFriend, setRecommendedNewFriend] = useState<friendDataType[]>([]);

  /** 取得好友邀請 */
  const handleGetFriendRequestList = async () => {
    const result = await getFriendList(userData?.uid || "", 2) as friendResponseType;
    if (result.code === "SUCCESS") {
      setFriendRequestList(result.data);
    }
  };

  /** 取得推薦好友(新朋友) */
  const handleGetRecommendedNewFriend = async () => {
    const result = await getRecommendedNewFriend(userData?.uid || "") as friendResponseType;
    if (result.code === "SUCCESS") {
      setRecommendedNewFriend(result.data);
    }
  };

  /** 取得推薦好友(可能認識的好友) */
  const handleGetRecommendedFriends = async () => {
    const result = await getRecommendedFriends(userData?.uid || "") as friendResponseType;
    if (result.code === "SUCCESS") {
      setRecommendedFriends(result.data);
    }
  };

  useEffect(() => {
    setRecentChatList(chatList?.slice(0, 3) || []);
  }, [chatList]);

  useEffect(() => {
    if (userData?.uid) {
      handleGetFriendRequestList();
      handleGetRecommendedFriends();
      handleGetRecommendedNewFriend();
    }
  }, [userData?.uid]);

  return (
    <div className="w-full p-5">
      <section className={cn(sectionStyle, "mb-5 px-6")}>
        <ProfileCard />
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 content-start w-full">
        {(recentChatList && recentChatList.length > 0) && (
          <section>
            <h4 className="text-left mb-2">近期訊息</h4>
            <div className={cn(sectionStyle, "md:min-h-[200px]")}>
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

        {friendRequestList.length > 0 && (
          <section>
            <h4 className="text-left mb-2">好友邀請</h4>
            <div className={cn(sectionStyle, "md:min-h-[200px]")}>
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
            <div className={cn(sectionStyle, "md:min-h-[200px]")}>
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

        {recommendedNewFriend.length > 0 && (
          <section>
            <h4 className="text-left mb-2">推薦好友</h4>
            <div className={cn(sectionStyle, "md:min-h-[200px]")}>
              {recommendedNewFriend.map((friend) => (
                <UserItem
                  key={friend.uid}
                  uid={friend.uid}
                  userName={friend.sourceUserData.userName}
                  avatarUrl={friend.sourceUserData.avatarUrl}
                  userAccount=""
                  bgColor={friend.sourceUserData.bgColor}
                  status={0}
                  chatRoomId=""
                />
              ))}
            </div>
          </section>
        )}

        {recommendedFriends.length > 0 && (
          <section>
            <h4 className="text-left mb-2">可能認識的好友</h4>
            <div className={cn(sectionStyle, "md:min-h-[200px]")}>
              {recommendedFriends.map((friend) => (
                <UserItem
                  key={friend.uid}
                  uid={friend.uid}
                  userName={friend.sourceUserData.userName}
                  avatarUrl={friend.sourceUserData.avatarUrl}
                  userAccount=""
                  bgColor={friend.sourceUserData.bgColor}
                  status={0}
                  chatRoomId=""
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
