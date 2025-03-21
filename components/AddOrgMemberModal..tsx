"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/store/hooks";
import { friendDataType } from "@/types/friendType";
import UserItem from "./UserItem";

interface memberListType extends friendDataType {
  isSelected: boolean;
}

function AddOrgMemberModal({
  orgMemberList,
  setMemberList,
  setAddMemberModal,
}: {
  orgMemberList: memberListType[];
  setMemberList: (memberList: memberListType[]) => void;
  setAddMemberModal: (addMemberModal: boolean) => void;
}) {
  const friendList = useAppSelector((state) => state.friend.friendList);
  const [friendBMList, setFriendBMList] = useState<memberListType[]>([]); // Friend Beyond Member List　(不在群組中的好友)
  const [newMemberList, setNewMemberList] = useState<memberListType[]>([]);
  const [searchValue, setSearchValue] = useState("");

  /** 確定新增成員 */
  const handleAddMember = async () => {
    const tempList = newMemberList.filter((member) => member.isSelected)
    .map((member) => {
      return {
        uid: member.uid,
        userName: member.sourceUserData.userName,
        avatarUrl: member.sourceUserData.avatarUrl,
        bgColor: member.sourceUserData.bgColor,
        isSelected: true,
      };
    }) as memberListType[];

    setMemberList([...orgMemberList, ...tempList]);
    setAddMemberModal(false);
  };

  /** 處理選項選取 */
  const handleSelect = (userId: string) => {
    const tempList = newMemberList.map((friend) => {
      if (friend.uid === userId) {
        return {
          ...friend,
          isSelected: !friend.isSelected,
        };
      }
      return friend;
    });
    setNewMemberList(tempList);
  };

  /** 處理搜尋功能 */
  const handleSearch = (value: string) => {
    const tempList = friendBMList?.filter((friend) => friend.sourceUserData.userName.includes(value));
    setNewMemberList(tempList as memberListType[]);
  };

  useEffect(() => {
    const tempList = friendList?.filter((friend) => !orgMemberList.some((member) => member.uid === friend.uid)).map((friend) => ({
      ...friend,
      isSelected: false,
    }));
    setNewMemberList(tempList || []);
    setFriendBMList(tempList || []);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-screen h-screen flex justify-center items-center z-50">
      <div className="relative w-full md:max-w-[600px] md:w-2/3 h-[calc(100vh-100px)] sm:h-[calc(100vh-50px)] md:h-auto my-[100px] sm:mt-[100px] sm:mb-[50px] bg-[var(--modal-bg-color)] text-[var(--text-color)] pt-12 pb-10 px-5 md:rounded-lg shadow-lg z-20">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="關閉視窗"
            className="absolute top-5 right-5"
            onClick={() => setAddMemberModal(false)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]"
            />
          </button>
        </div>
        <h3 className="mb-5">選擇新成員</h3>
        <form className="w-full md:w-auto h-[calc(100%-50px)] md:h-[400px] flex flex-col justify-center items-start gap-2">
          <div className="w-full h-full">
            <div className="relative">
              <input
                type="text"
                className="formInput my-2 px-4"
                value={searchValue}
                placeholder="搜尋好友"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              {searchValue.length > 0 && (
                <button
                  type="button"
                  className="absolute right-2 top-0 h-full px-2 text-[var(--disable)] hover:text-[var(--active)]"
                  onClick={() => {
                    setSearchValue("")
                    handleSearch("");
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2 h-[calc(100%-55px)] md:max-h-[350px] overflow-y-auto">
              {newMemberList.length === 0 ? (
                searchValue.length > 0 ? (
                  <p className="text-center text-gray-500">-找不到好友-</p>
                ) : (
                  <p className="text-center text-gray-500">-好友似乎都在群組中了-</p>
                )
              ) : (
                newMemberList?.map((friend) => (
                  <UserItem
                    key={friend.uid}
                    uid={friend.uid}
                    userName={friend.sourceUserData.userName}
                    avatarUrl={friend.sourceUserData.avatarUrl}
                    userAccount=""
                    bgColor={friend.sourceUserData.bgColor}
                    chatRoomId={friend.chatRoomId}
                    type="select"
                    isSelected={friend.isSelected}
                    handleSelect={handleSelect}
                  />
                ))
              )}
            </div>
          </div>
          <div className="w-full flex justify-center items-center mt-2">
            <button
              type="button"
              className="w-60 text-lg py-2 rounded-full bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)]"
              onClick={handleAddMember}
            >
              確定
            </button>
          </div>
        </form>
      </div>
      <div className="fixed top-0 left-0 w-screen h-screen cursor-default z-10 bg-gray-900 opacity-60" />
    </div>
  );
}

export default AddOrgMemberModal;
