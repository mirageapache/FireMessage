/* eslint-disable react/require-default-props */
import React from "react";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Avatar from "./Avatar";

interface UserItemProps {
  uid: string;
  userName: string;
  avatarUrl: string;
  userAccount: string;
  status?: number;
  bgColor: string;
}

function UserItem({
  uid,
  userName,
  avatarUrl,
  userAccount,
  status,
  bgColor,
}: UserItemProps) {
  let linkString = "";
  switch (status) {
    case 0:
      linkString = `/userProfile/${uid}`;
      break;
    case 5:
      linkString = "/chat";
      break;
    default:
      linkString = `/userProfile/${uid}`;
  }

  return (
    <Link href={linkString} className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] cursor-pointer px-3 py-2 rounded-lg">
      <div>
        <Avatar
          userName={userName}
          avatarUrl={avatarUrl}
          classname="w-10 h-10"
          textSize="text-sm"
          bgColor={bgColor}
        />
      </div>
      <div className="w-full px-2">
        <p>{userName}</p>
        <p className="text-[var(--secondary-text-color)] text-sm line-clamp-1">{userAccount}</p>
      </div>
      {(status === 0) && (
        <div className="flexjustify-center items-center hover:text-[var(--active)]">
          <FontAwesomeIcon icon={faUserPlus} className="w-8 h-5" />
        </div>
      )}
    </Link>
  );
}

export default UserItem;
