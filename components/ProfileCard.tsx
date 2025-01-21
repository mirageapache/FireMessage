"use client";

import React from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import Avatar from "./Avatar";

function ProfileCard() {
  const userData = useSelector((state: RootState) => state.user.userData);

  return (
    <>
      <div className="flex justify-between items-center w-full border-b border-gray-200 mb-2 pb-2">
        <span>
          <h3>{userData?.userName}</h3>
          <p className="pl-1">{userData?.userAccount}</p>
        </span>
        <span>
          <Avatar
            avatarUrl={userData?.avatarUrl || ""}
            userName={userData?.userName || ""}
            size="w-14 h-14"
            textSize="text-2xl"
            bgColor={userData?.bgColor || ""}
          />
        </span>
      </div>
      <div className="w-full">
        {isEmpty(userData?.biography) ? (
          <i className="text-gray-500">尚未設定個人簡介</i>
        ) : (
          <p>{userData?.biography}</p>
        )}
      </div>
    </>
  );
}

export default ProfileCard;
