import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Avatar from "./Avatar";

interface UserItemProps {
  userName: string;
  avatarUrl: string;
  userAccount: string;
}

function UserItem({
  userName,
  avatarUrl,
  userAccount,

}: UserItemProps) {
  return (
    <div className="flex justify-between items-center w-full hover:bg-gray-700 cursor-pointer px-3 py-2 rounded-lg">
      <div>
        <Avatar
          userName={userName}
          avatarUrl={avatarUrl}
          size="w-10 h-10"
          textSize="text-sm"
          bgColor="#3b82f6"
        />
      </div>
      <div className="w-full px-2">
        <p>{userName}</p>
        <p className="text-gray-500 text-sm line-clamp-1">{userAccount}</p>
      </div>
      <div className="flexjustify-center items-center">
        <FontAwesomeIcon icon={faUserPlus} className="w-8 h-5" />
      </div>
    </div>
  );
}

export default UserItem;
