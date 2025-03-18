"use client";

import React, { useEffect, useState } from "react";
import { getOrganizationData } from "@/lib/organization";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { organizationDataType } from "@/types/organizationType";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { setActiveChatRoom } from "@/store/chatSlice";
import Avatar from "@/components/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

function Organization() {
  const dispatch = useAppDispatch();
  const uid = useAppSelector((state) => state.user.userData?.uid);
  const [isLoading, setIsLoading] = useState(false);
  const [orgListData, setOrgListData] = useState<organizationDataType[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string>(""); // 判斷開啟選單的選項
  const [linkUrl, setLinkUrl] = useState("/chat");
  const dropdownItemStyle = "w-full text-left hover:text-[var(--active)] hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg";

  /** 取得群組列表資料 */
  const handleGetOrgList = async () => {
    setIsLoading(true);
    const result = await getOrganizationData(uid!);
    if (result.code === "SUCCESS") {
      setOrgListData(result.data as unknown as organizationDataType[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (uid) {
      handleGetOrgList();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setLinkUrl(window.innerWidth < 768 ? "/chatRoom" : "/chat");
    };
    handleResize();
    // 監聽視窗大小變化，調整聊天室顯示路徑
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const orgList = orgListData.map((item) => (
    <div
      key={item.orgId}
      className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] rounded-lg cursor-pointer"
    >
      <Link
        href={linkUrl}
        className="flex justify-between items-center w-full hover:bg-[var(--hover-bg-color)] cursor-pointer px-3 py-2 rounded-lg"
        onClick={() => {
          if (item.chatRoomId) {
            dispatch(
              setActiveChatRoom({
                chatRoom: {
                  chatRoomId: item.chatRoomId,
                  chatRoomName: item.organizationName,
                  members: item.members,
                  type: 1,
                  avatarUrl: item.avatarUrl,
                  bgColor: item.bgColor,
                  lastMessage: "",
                  lastMessageTime: "",
                  createdAt: "",
                  unreadCount: 0,
                },
              }),
            );
          }
        }}
      >
        <div>
          <Avatar
            userName={item.organizationName}
            avatarUrl={item.avatarUrl}
            classname="w-10 h-10 max-w-10 max-h-10"
            textSize="text-sm"
            bgColor={item.bgColor}
          />
        </div>
        <div className="w-full px-2">
          <p>{item.organizationName}</p>
        </div>
      </Link>
      <div className="relative flex justify-center items-center gap-2 z-20">
        <button
          type="button"
          className="mr-2 hover:bg-gray-500 dark:hover:bg-gray-800 rounded-lg p-1 text-[var(--secondary-text-color)] hover:text-[var(--active)]"
          onClick={() => setOpenDropdownId(item.orgId)}
        >
          <FontAwesomeIcon
            icon={faEllipsis}
            className="w-6 h-5 translate-y-[2px]"
          />
        </button>
        {openDropdownId === item.orgId && (
          <button
            type="button"
            className="fixed sm:absolute w-full sm:w-40 top-20 sm:top-10 right-0 flex justify-center items-center sm:justify-end z-20"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId("");
            }}
          >
            <div className="relative w-4/5 sm:w-40 flex flex-col gap-2 justify-center items-center bg-[var(--card-bg-color)] rounded-lg p-2 z-10">
              <Link
                href={linkUrl}
                className={cn(dropdownItemStyle)}
                onClick={() => {
                  dispatch(
                    setActiveChatRoom({
                      chatRoom: {
                        chatRoomId: item.chatRoomId,
                        chatRoomName: item.organizationName,
                        members: item.members,
                        type: 0,
                        avatarUrl: item.avatarUrl,
                        bgColor: item.bgColor,
                        lastMessage: "",
                        lastMessageTime: "",
                        createdAt: "",
                        unreadCount: 0,
                      },
                    }),
                  );
                }}
              >
                聊天
              </Link>
              <Link
                href={`/organizationProfile/${item.orgId}`}
                className={cn(dropdownItemStyle)}
              >
                查看群組資訊
              </Link>
              <span className="flex justify-center before:[''] before:absolute before:w-full before:h-[1px] before:bg-[var(--divider-color)]" />
              <button type="button" className={cn(dropdownItemStyle)}>
                封鎖
              </button>
              <button type="button" className={cn(dropdownItemStyle)}>
                刪除
              </button>
            </div>
          </button>
        )}
      </div>
    </div>
  ));

  return (
    <div className="relative pt-3 sm:px-5">
      <div className="m-2 border-b border-[var(--divider-color)]">
        <h4 className="my-1">群組列表</h4>
        {isLoading ? (
          <div className="my-2">
            <Spinner />
          </div>
        ) : (
          orgList
        )}
      </div>
      {openDropdownId.length > 0 && (
        <button
          aria-label="關閉選單"
          type="button"
          className="fixed top-0 left-0 w-screen h-screen bg-gray-900 opacity-60 sm:bg-transparent cursor-default z-10"
          onClick={() => setOpenDropdownId("")}
        />
      )}
    </div>
  );
}

export default Organization;
