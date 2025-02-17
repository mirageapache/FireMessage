"use client";

import Avatar from '@/components/Avatar';
import Spinner from '@/components/Spinner';
import { getFriendList, updateBothFriendStatus } from '@/lib/friend';
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { setFriendList } from '@/store/friendSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveChatRoomId } from '@/store/sysSlice';
import { friendDataType, friendResponseType } from '@/types/friendType';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Friend() {
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const FriendListData = useAppSelector((state: RootState) => state.friend.friendList);
  const [isLoading, setIsLoading] = useState(true);
  const [friendData, setFriendData] = useState<friendDataType[]>([]);
  const [friendRequestList, setFriendRequestList] = useState<friendDataType[]>([]);
  const [openDropdownUid, setOpenDropdownUid] = useState<string>(""); // 判斷開啟選單的選項
  const dispatch = useAppDispatch();
  const dropdownItemStyle = "w-full text-left hover:text-[var(--active)] hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg";

  /** 取得好友邀請 */
  const handleGetFriendRequestList = async () => {
    const result = await getFriendList(userData?.uid || "", 2) as friendResponseType;
    if (result.code === "SUCCESS") {
      setFriendRequestList(result.data);
    }
  };

  /** 取得好友列表 */
  const handleGetFriendList = async () => {
    const result = await getFriendList(userData?.uid || "", 5) as friendResponseType;
    if (result.code === "SUCCESS") {
      setFriendData(result.data);
      dispatch(setFriendList(result.data));
    }
  };

  /** 更新好友狀態 */
  const handleUpdateFriendStatus = async (uid: string, friendUid: string, status: number) => {
    const result = await updateBothFriendStatus(uid, friendUid, status);
    if (result.code === "SUCCESS") {
      if (status === 5) {
        handleGetFriendRequestList();
        handleGetFriendList();
        toast.success("已成為好友！");
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(FriendListData)) {
      setFriendData(FriendListData!);
      setIsLoading(false);
    }
  }, [FriendListData]);

  useEffect(() => {
    if (userData?.uid) {
      handleGetFriendRequestList();
    }
  }, [userData?.uid]);

  /** 好友邀請列表 */
  const RequestList = friendRequestList.map((item) => (
    <div key={item.uid} className="flex justify-between items-center gap-2 hover:bg-[var(--hover-bg-color)] p-2 rounded-lg cursor-pointer">
      <div className="flex items-center gap-2">
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
      </div>
      <div className="flex justify-center items-center gap-2">
        <button
          type="button"
          className="bg-[var(--success)] hover:bg-[var(--success-hover)] text-white px-2 py-1 rounded-lg"
          onClick={() => {
            handleUpdateFriendStatus(userData?.uid || "", item.uid, 5);
          }}
        >
          接受
        </button>
        <button
          type="button"
          className="bg-[var(--error)] hover:bg-[var(--error-hover)] text-white px-2 py-1 rounded-lg"
          onClick={() => {
            handleUpdateFriendStatus(userData?.uid || "", item.uid, 0);
          }}
        >
          拒絕
        </button>
      </div>
    </div>
  ));

  /** 好友列表 */
  const FriendList = (isEmpty(friendData)) ? <p>-尚無好友-</p> : friendData!.map((item) => (
    <Link
      key={item.uid}
      href={`/userProfile/${item.uid}`}
      className="flex justify-between items-center gap-2 hover:bg-[var(--hover-bg-color)] p-2 rounded-lg cursor-pointer"
    >
      <div className="flex items-center gap-2">
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
      </div>
      <div className="relative flex justify-center items-center gap-2">
        <button
          type="button"
          className="mr-2 hover:bg-gray-500 dark:hover:bg-gray-800 rounded-lg p-1 text-[var(--secondary-text-color)] hover:text-[var(--active)]"
          onClick={() => {
            setOpenDropdownUid(item.uid);
          }}
        >
          <FontAwesomeIcon icon={faEllipsis} className="w-6 h-5 translate-y-[2px]" />
        </button>
        {openDropdownUid === item.uid && (
          <div className="absolute top-10 right-0 w-4/5 sm:w-40 flex flex-col gap-2 justify-center items-center bg-[var(--card-bg-color)] rounded-lg p-2">
            <Link
              href="/chat"
              className={cn(dropdownItemStyle)}
              onClick={() => {
                dispatch(setActiveChatRoomId(item.uid));
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
    </Link>
  ));

  return (
    <div className="relative">
      {!isEmpty(RequestList) && (
        <div className="my-2 border-b border-[var(--divider-color)] pb-2">
          <h4>好友邀請</h4>
          {RequestList}
        </div>
      )}
      <div className="my-2 border-b border-[var(--divider-color)] pb-2">
        <h4>好友列表</h4>
        {isLoading ? (
          <div className="my-2">
            <Spinner />
          </div>
        ) : (
          FriendList
        )}
      </div>
      <button
        aria-label="關閉選單"
        type="button"
        className="fixed top-0 left-0 w-screen h-screen cursor-default z-10"
        onClick={() => setOpenDropdownUid("")}
      />
    </div>
  );
}

export default Friend;
