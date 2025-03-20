"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks";
import { friendDataType } from "@/types/friendType";
import { createOrganization } from "@/lib/organization";
import Spinner from "./Spinner";
import UserItem from "./UserItem";

interface memberListType extends friendDataType {
  isSelected: boolean;
}

function CreateOrgModal({
  setCreateOrgModal,
}: {
  setCreateOrgModal: (createOrgModal: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [memberList, setMemberList] = useState<memberListType[]>([]);
  const uid = useAppSelector((state) => state.user.userData?.uid);
  const friendList = useAppSelector((state) => state.friend.friendList);

  /** 建立群組 */
  const handleCreateOrg = async () => {
    setIsLoading(true);
    if (orgName.length > 20) return;
    const members = memberList.filter((member) => member.isSelected).map((member) => member.uid);
    const res = await createOrganization(uid!, orgName, members);
    if (res.code === "SUCCESS") {
      setCreateOrgModal(false);
      toast.success(res.message);
    }
    setIsLoading(false);
  };

  /** 處理選項選取 */
  const handleSelect = (userId: string) => {
    const tempList = memberList.map((friend) => {
      if (friend.uid === userId) {
        return {
          ...friend,
          isSelected: !friend.isSelected,
        };
      }
      return friend;
    });
    setMemberList(tempList);
  };

  useEffect(() => {
    const tempList = friendList?.map((friend) => ({
      ...friend,
      isSelected: false,
    }));
    setMemberList(tempList || []);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-screen h-screen flex justify-center items-center z-50">
      <div className="relative w-full md:max-w-[600px] md:w-2/3 h-[calc(100vh-100px)] sm:h-[calc(100vh-50px)] md:h-auto my-[100px] sm:mt-[100px] sm:mb-[50px] bg-[var(--modal-bg-color)] text-[var(--text-color)] pt-12 pb-10 px-5 md:rounded-lg shadow-lg z-20">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="關閉視窗"
            className="absolute top-5 right-5"
            onClick={() => {
              Swal.fire({
                title: "要取消建立群組嗎？",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "確定",
                cancelButtonText: "取消",
              }).then((result) => {
                if (result.isConfirmed) {
                  setCreateOrgModal(false);
                }
              });
            }}
          >
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]"
            />
          </button>
        </div>
        <h3 className="mb-5">建立新群組</h3>
        <form className="w-full md:w-auto h-[calc(100%-50px)] md:h-[400px] flex flex-col justify-center items-start gap-2">
          <div className="w-full h-full">
            <input
              type="text"
              className="formInput px-4"
              placeholder="請輸入群組名稱"
              maxLength={20}
              onChange={(e) => {
                if (e.target.value.length > 20) return;
                setOrgName(e.target.value);
              }}
            />
            <div className="w-full mt-5 border-t-[1px] border-[var(--divider-color)] pt-5">
              <h5 className="text-center">請選擇群組成員</h5>
              <input type="text" className="formInput my-2 px-4" placeholder="搜尋好友" />
              <div className="flex flex-col gap-2 h-[calc(100%-55px)] md:max-h-[350px] overflow-y-auto">
                {memberList?.map((friend) => (
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
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center mt-2">
            <button
              type="button"
              className="w-60 text-lg py-2 rounded-full bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)]"
              onClick={handleCreateOrg}
            >
              {isLoading ? <Spinner text="建立中..." /> : "建立"}
            </button>
          </div>
        </form>
      </div>
      <div className="fixed top-0 left-0 w-screen h-screen cursor-default z-10 bg-gray-900 opacity-60" />
    </div>
  );
}

export default CreateOrgModal;
