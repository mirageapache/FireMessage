"use client";

import Avatar from '@/components/Avatar';
import { getFriendList, updateBothFriendStatus } from '@/lib/friend';
import { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { friendDataType, friendResponseType } from '@/types/friendType';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Friend() {
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const [friendData, setFriendData] = useState<friendDataType[]>([]);
  const [friendRequestList, setFriendRequestList] = useState<friendDataType[]>([]);

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
    if (userData?.uid) {
      handleGetFriendRequestList();
      handleGetFriendList();
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
          className="bg-[var(--success)] hover:bg-[var(--success-hover)] text-white px-2 py-1 rounded-md"
          onClick={() => {
            handleUpdateFriendStatus(userData?.uid || "", item.uid, 5);
          }}
        >
          接受
        </button>
        <button
          type="button"
          className="bg-[var(--error)] hover:bg-[var(--error-hover)] text-white px-2 py-1 rounded-md"
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
  const FriendList = friendData.length === 0 ? <p>-尚無好友-</p> : friendData.map((item) => (
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
        <p>{moment(item.createdAt).format("YYYY-MM-DD")}</p>
      </div>
    </div>
  ));

  return (
    <div>
      {!isEmpty(RequestList) && (
        <div className="mb-2 border-b border-[var(--divider-color)] pb-2">
          <h4>好友邀請</h4>
          {RequestList}
        </div>
      )}
      <div className="mb-2 border-b border-[var(--divider-color)] pb-2">
        <h4>好友列表</h4>
        {FriendList}
      </div>
    </div>
  );
}

export default Friend;
