import React from "react";
import Avatar from "./Avatar";

function ProfileCard() {
  return (
    <>
      <div className="flex justify-between items-center w-full border-b border-gray-200 mb-2 pb-2">
        <span>
          <h3>James</h3>
          <p className="pl-1">james_w11</p>
        </span>
        <span>
          <Avatar
            avatarUrl={""}
            userName="James"
            size="w-14 h-14"
            textSize="text-2xl"
            bgColor="#06b6d4"
          />
        </span>
      </div>
      <div className="w-full">
        <p>Hi, I am James</p>
        <p>‍💻 Frontend Engineer from TW</p>
        <p>📨 工作邀約請連繫：james11@test.com.tw</p>
      </div>
    </>
  );
}

export default ProfileCard;
