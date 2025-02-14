"use client";

import ChatItem from "@/components/ChatItem";
import ProfileCard from "@/components/ProfileCard";
import UserItem from "@/components/UserItem";
import { checkNewFriend } from "@/lib/friend";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import React from "react";

function Dashboard() {
  const sectionStyle = "flex flex-col justify-center items-center h-fit py-4 px-4 bg-[var(--card-bg-color)] rounded-lg";
  const friendList = useAppSelector((state) => state.friend.friendList);
  const newFriendList = checkNewFriend(friendList);

  return (
    <div className="w-full py-5 md:p-0">
      <section className={cn(sectionStyle, "my-4 px-6")}>
        <ProfileCard />
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 content-start w-full">
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
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h4 className="text-left mb-2">未讀訊息</h4>
          <div className={sectionStyle}>
            <ChatItem
              userName="Test"
              avatarUrl=""
              lastMessage="Test"
              lastMessageTime="12:00"
              unreadCount={2}
            />
            <ChatItem
              userName="Test"
              avatarUrl=""
              lastMessage="Test"
              lastMessageTime="12:00"
              unreadCount={2}
            />
            <ChatItem
              userName="Test"
              avatarUrl=""
              lastMessage="Test"
              lastMessageTime="12:00"
              unreadCount={2}
            />
          </div>
        </section>

        {/* <section>
          <h4 className="text-left mb-2">推薦好友</h4>
          <div className={sectionStyle}>
            <UserItem
              uid="Test_1"
              userName="Test"
              avatarUrl=""
              userAccount="Test_1"
              bgColor="#3b82f6"
            />
            <UserItem
              uid="Test_2"
              userName="Test"
              avatarUrl=""
              userAccount="Test_2"
              bgColor="#3b82f6"
            />
            <UserItem
              uid="Test_3"
              userName="Test"
              avatarUrl=""
              userAccount="Test_3"
              bgColor="#3b82f6"
            />
          </div>
        </section> */}
      </div>
    </div>
  );
}

export default Dashboard;
