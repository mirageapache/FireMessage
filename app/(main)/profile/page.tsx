"use client";

import React from "react";
import Image from "next/image";
import moment from "moment";
import { isEmpty } from "lodash";
import { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks";
import Avatar from "@/components/Avatar";

function Profile() {
  const userData = useAppSelector((state: RootState) => state.user.userData);

  return (
    <div>
      <section className="h-[150px] bg-[var(--card-bg-color)]">
        <Image src="" alt="cover" width={0} height={200} className="w-full h-full object-cover" />
      </section>
      <div className="relative h-[50px]">
        <Avatar
          userName={userData?.userName || ""}
          avatarUrl={userData?.avatarUrl || ""}
          classname="w-[100px] h-[100px] absolute top-[-70px] left-10 border"
          textSize="text-5xl"
          bgColor={userData?.bgColor || ""}
        />
      </div>
      <section className="flex flex-col gap-2 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <div className="flex justify-start items-end gap-2">
          <h2 className="text-left">{userData?.userName}</h2>
          <p className="text-[var(--secondary-text-color)]">
            @
            {userData?.userAccount}
          </p>
        </div>
        <div>
          {isEmpty(userData?.biography) ? (
            <p className="text-[var(--secondary-text-color)]">
              尚未設定個人簡介
            </p>
          ) : (
            <p className="text-[var(--text-color)]">{userData?.biography}</p>
          )}
        </div>
      </section>
      <section className="px-4">
        <div className="flex justify-between items-center">
          <p>註冊日期</p>
          <p>{moment(userData?.createdAt).format("YYYY/MM/DD")}</p>
        </div>
      </section>
    </div>
  );
}

export default Profile;
