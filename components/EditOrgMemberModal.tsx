"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { updateOrganizationData } from "@/lib/organization";
import { organizationDataType } from "@/types/organizationType";
import { useAppSelector } from "@/store/hooks";
import { friendDataType } from "@/types/friendType";
import Spinner from "./Spinner";
import UserItem from "./UserItem";
import { getSimpleUserData } from "@/lib/user";
import { userDataType } from "@/types/userType";

interface memberListType extends friendDataType {
  isSelected: boolean;
}

function EditOrgMemberModal({
  setEditmode,
  orgData,
  setOrgData
}: {
  setEditmode: (editmode: boolean) => void;
  orgData: organizationDataType;
  setOrgData: (orgData: organizationDataType) => void;
}) {
  const uid = useAppSelector((state) => state.user.userData?.uid);
  const friendList = useAppSelector((state) => state.friend.friendList);
  const [isLoading, setIsLoading] = useState(false);
  const [memberList, setMemberList] = useState<memberListType[]>([]);

  /** 更新群組成員 */
  const handleUpdateOrgMember = async () => {
    setIsLoading(true);
    const result = await updateOrganizationData(orgData.orgId, {
      ...orgData,
      members: [...orgData.members],
    });
  };

  /** 更新群組state資料 */
  const updateOrgData = (result: { imageUrl: string, public_id: string }, imgType: string) => {
    if (imgType === "cover") {
      setOrgData({ ...orgData, coverUrl: result.imageUrl, coverPublicId: result.public_id });
    } else {
      setOrgData({ ...orgData, avatarUrl: result.imageUrl, avatarPublicId: result.public_id });
    }
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

  /** 取得群組成員資料 */
  const getMemberList = async () => {
    const tempList = orgData.members.map(async (member) => {
      const memberData = await getSimpleUserData(member);
      return {
        ...memberData,
        isSelected: true,
      };
    });
    const memberList = await Promise.all(tempList);
    setMemberList(memberList as memberListType[]);
  };

  useEffect(() => {
    getMemberList();
  }, []);

  console.log(memberList);

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
                title: "要取消編輯成員嗎？",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "確定",
                cancelButtonText: "取消",
              }).then((result) => {
                if (result.isConfirmed) {
                  setEditmode(false);
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
        <h3 className="mb-5">群組成員</h3>
        <form className="w-full md:w-auto h-[calc(100%-50px)] md:h-[400px] flex flex-col justify-center items-start gap-2">
          <div className="w-full h-full">
            <input type="text" className="formInput my-2 px-4" placeholder="搜尋成員" />
            <div className="flex flex-col gap-2 h-[calc(100%-55px)] md:max-h-[350px] overflow-y-auto">
              {memberList?.map((member) => (
                <UserItem
                  key={member.uid}
                  uid={member.uid}
                  userName={member.userName}
                  avatarUrl={member.avatarUrl}
                  userAccount=""
                  bgColor={member.bgColor}
                  chatRoomId={orgData.chatRoomId}
                  type="select"
                  isSelected={member.isSelected}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        </form>
        <div className="w-full flex justify-center items-center mt-2">
          <button
            type="button"
            className="w-60 text-lg py-2 rounded-full bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)]"
            onClick={handleUpdateOrgMember}
          >
            {isLoading ? <Spinner /> : "確定"}
          </button>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-screen h-screen cursor-default z-10 bg-gray-900 opacity-60" />
    </div>
  );
}

export default EditOrgMemberModal;
