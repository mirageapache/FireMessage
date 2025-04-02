"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import { setActiveChatRoom } from '@/store/chatSlice';
import { friendDataType } from '@/types/friendType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Avatar from './Avatar';

function FriendList(friendData: friendDataType[]) {
  const dispatch = useAppDispatch();
  const uid = useAppSelector((state) => state.user.userData?.uid);
  const [openDropdownUid, setOpenDropdownUid] = useState<string>(""); // 判斷開啟選單的選項
  const dropdownItemStyle = "w-full text-left hover:text-[var(--active)] hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg";

  if (isEmpty(friendData)) return <p>-尚無好友-</p>;

  const FriendListData = friendData!.map((item) => (
    <div
      key={item.uid}
      className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] rounded-lg cursor-pointer"
    >
      <Link
        href="/chat"
        className="flex items-center gap-2 w-full p-2"
        onClick={() => {
          dispatch(setActiveChatRoom({
            chatRoom: {
              chatRoomId: item.chatRoomId,
              chatRoomName: item.userName,
              members: [item.uid, uid!],
              type: 0,
              avatarUrl: item.avatarUrl,
              bgColor: item.bgColor,
              lastMessage: "",
              lastMessageTime: "",
              unreadCount: 0,
              createdAt: "",
              lastIndexTime: '',
              hasMore: false,
            },
          }));
        }}
      >
        <Avatar
          userName={item.sourceUserData.userName}
          avatarUrl={item.sourceUserData.avatarUrl}
          bgColor={item.sourceUserData.bgColor}
          classname="w-10 h-10"
          textSize="text-sm"
        />
        <p>
          <strong>{item.sourceUserData.userName}</strong>
        </p>
      </Link>
      <div className="relative flex justify-center items-center gap-2 z-20">
        <button
          type="button"
          className="mr-2 hover:bg-gray-500 dark:hover:bg-gray-800 rounded-lg p-1 text-[var(--secondary-text-color)] hover:text-[var(--active)]"
          onClick={() => setOpenDropdownUid(item.uid)}
        >
          <FontAwesomeIcon icon={faEllipsis} className="w-6 h-5 translate-y-[2px]" />
        </button>
        {openDropdownUid === item.uid && (
          <div className="absolute top-10 right-0 w-4/5 sm:w-40 flex flex-col gap-2 justify-center items-center bg-[var(--card-bg-color)] rounded-lg p-2">
            <Link
              href="/chat"
              className={cn(dropdownItemStyle)}
              onClick={() => {
                dispatch(setActiveChatRoom({
                  chatRoom: {
                    chatRoomId: item.chatRoomId,
                    chatRoomName: item.userName,
                    members: [item.uid, uid!],
                    type: 0,
                    avatarUrl: item.avatarUrl,
                    bgColor: item.bgColor,
                    lastMessage: "",
                    lastMessageTime: "",
                    unreadCount: 0,
                    createdAt: "",
                    lastIndexTime: '',
                    hasMore: false,
                  },
                }));
              }}
            >
              聊天
            </Link>
            <Link href={`/userProfile/${item.uid}`} className={cn(dropdownItemStyle)}>查看好友資訊</Link>
            <span className="flex justify-center before:[''] before:absolute before:w-full before:h-[1px] before:bg-[var(--divider-color)]" />
            <button type="button" className={cn(dropdownItemStyle)}>封鎖</button>
            <button type="button" className={cn(dropdownItemStyle)}>刪除</button>
          </div>
        )}
      </div>
    </div>
  ));

  return (
    <div>
      {FriendListData}
    </div>
  );
}

export default FriendList;
