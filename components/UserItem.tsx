/* eslint-disable react/require-default-props */
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { setActiveChatRoom } from "@/store/chatSlice";
import { useAppDispatch } from "@/store/hooks";
import Avatar from "./Avatar";

interface UserItemProps {
  uid: string;
  userName: string;
  avatarUrl: string;
  userAccount: string;
  status?: number;
  bgColor: string;
  chatRoomId: string | null;
  type?: string;
  isSelected?: boolean;
  handleSelect?: (uid: string) => void;
}

function UserItem({
  uid,
  userName,
  avatarUrl,
  userAccount,
  status,
  bgColor,
  chatRoomId,
  type = "link", // 預設link作為連結 / select為可選取項目
  isSelected = false, // 做為選項時使用
  handleSelect = () => {},
}: UserItemProps) {
  const dispatch = useAppDispatch();

  let linkString = `/userProfile/${uid}`;
  switch (status) {
    case 5:
      if (chatRoomId) {
        linkString = "/chat"; // 是好友且有chatRoomId才導到聊天介面
      }
      break;
    default:
      linkString = `/userProfile/${uid}`;
  }

  if (type === "select") {
    return (
      <button
        type="button"
        className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] cursor-pointer px-3 py-2 rounded-lg"
        onClick={() => handleSelect(uid)}
      >
        <div className="flex items-center gap-2">
          <Avatar
            userName={userName}
            avatarUrl={avatarUrl}
            classname="w-8 h-8 max-w-8 max-h-8"
            textSize="text-sm"
            bgColor={bgColor}
          />
          <p>{userName}</p>
        </div>
        <div
          className={cn(
            "flex justify-center items-center",
            isSelected ? "text-[var(--active)]" : "text-[var(--disable)]",
          )}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="w-8 h-5" />
        </div>
      </button>
    );
  }

  return (
    <Link
      href={linkString}
      className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] cursor-pointer px-3 py-2 rounded-lg"
      onClick={() => {
        if (status === 5 && chatRoomId) {
          dispatch(setActiveChatRoom({
            chatRoom: {
              chatRoomId,
              chatRoomName: userName,
              members: [uid],
              type: 0,
              avatarUrl,
              bgColor,
              lastMessage: "",
              lastMessageTime: "",
              createdAt: "",
              unreadCount: 0,
            },
          }));
        }
      }}
    >
      <div>
        <Avatar
          userName={userName}
          avatarUrl={avatarUrl}
          classname="w-10 h-10 max-w-10 max-h-10"
          textSize="text-sm"
          bgColor={bgColor}
        />
      </div>
      <div className="w-full px-2">
        <p>{userName}</p>
        {userAccount && (
          <p className="text-[var(--secondary-text-color)] text-sm line-clamp-1">{userAccount}</p>
        )}
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
