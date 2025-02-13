/* eslint-disable jsx-a11y/label-has-associated-control */

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import { getUserData } from "@/lib/user";
import { userDataType } from "@/types/userType";
import { useAppSelector } from "@/store/hooks";
import { createFriendRequest } from "@/lib/friend";
import { toast } from "react-toastify";

function UserProfile({ params }: { params: { uid: string } }) {
  const currentUid = useAppSelector((state) => state.user.userData?.uid); // 當前使用者
  const router = useRouter();
  if (currentUid === params.uid) router.push("/profile");

  const [userData, setUserData] = useState<userDataType>();
  const listItemStyle = "flex justify-between items-center";

  /** 取得用戶資料 */
  const handleGetUserData = async () => {
    const result = await getUserData(params.uid, currentUid!) as unknown as userDataType;
    setUserData(result);
  };

  useEffect(() => {
    if (currentUid) handleGetUserData();
  }, [currentUid]);

  return (
    <>
      {/* 封面 */}
      <section className="relative h-[200px] bg-[var(--card-bg-color)]">
        {(userData && userData?.coverUrl && userData?.coverUrl !== "") && (
          <Image
            src={userData?.coverUrl || ""}
            alt="cover"
            width={1200}
            height={200}
            className="w-full h-full object-cover"
          />
        )}
      </section>

      {/* 頭貼 */}
      <section className="relative h-[50px] z-10">
        <Avatar
          userName={userData?.userName || ""}
          avatarUrl={userData?.avatarUrl || ""}
          classname="absolute top-[-70px] w-[100px] h-[100px] bg-[var(--card-bg-color)] left-10"
          textSize="text-3xl sm:text-5xl"
          bgColor={userData?.bgColor || ""}
        />
      </section>

      {/* 個人資料 */}
      <section className="flex flex-col gap-2 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <div className="flex justify-between items-start">
          <span className="flex justify-start items-end gap-2">
            <h2 className="text-left">{userData?.userName}</h2>
            <p className="text-[var(--secondary-text-color)]">
              @
              {userData?.userAccount}
            </p>
          </span>
        </div>
        <div>
          {isEmpty(userData?.biography) ? (
            <p className="text-[var(--secondary-text-color)]">
              尚未設定個人簡介
            </p>
          ) : (
            <p className="text-[var(--text-color)] whitespace-pre-wrap">
              {userData?.biography}
            </p>
          )}
        </div>
        <div className="text-right">
          {userData?.friendStatus === 0 && (
            <Button
              type="button"
              aria-label="發送好友邀請"
              className="w-full sm:w-auto bg-[var(--success)] hover:bg-[var(--success-hover)]"
              onClick={async () => {
                const reuslt = await createFriendRequest(currentUid || "", params.uid);
                if (reuslt.code === "SUCCESS") {
                  toast.success(reuslt.message);
                } else {
                  toast.error(reuslt.message);
                }
              }}
            >
              發送好友邀請
            </Button>
          )}
          {userData?.friendStatus === 1 && (
            <Button
              type="button"
              disabled
              className="w-full sm:w-auto bg-[var(--disable)]"
            >
              已發送好友邀請
            </Button>
          )}
          {userData?.friendStatus === 5 && (
            <Button
              type="button"
              aria-label="好友管理"
              className="w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
            >
              好友管理
            </Button>
          )}
        </div>
      </section>

      {/* 詳細資訊 */}
      <section className="flex flex-col gap-4 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <h5 className="sm:text-left">詳細資訊</h5>
        <div className={cn(listItemStyle)}>
          <p>Email</p>
          <p>{userData?.email}</p>
        </div>
        <div className={cn(listItemStyle)}>
          <p>加入日期</p>
          <p>{moment(userData?.createdAt).format("YYYY/MM/DD")}</p>
        </div>
      </section>

      {/* 返回 */}
      <section className="flex justify-center items-center pb-5 px-4">
        <Button type="button" className="w-full sm:w-auto bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)]" onClick={() => router.push("/dashboard")}>返回</Button>
      </section>
    </>
  );
}

export default UserProfile;
