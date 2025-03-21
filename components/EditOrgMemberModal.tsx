"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { updateOrganizationData } from "@/lib/organization";
import { organizationDataType } from "@/types/organizationType";
import { friendDataType } from "@/types/friendType";
import { useAppSelector } from "@/store/hooks";
import { getSimpleUserData } from "@/lib/user";
import Spinner from "./Spinner";
import UserItem from "./UserItem";
import { Button } from "./ui/button";
import AddOrgMemberModal from "./AddOrgMemberModal.";

interface memberListType extends friendDataType {
  isSelected: boolean;
}

function EditOrgMemberModal({
  setEditmode,
  orgData,
  setOrgData,
}: {
  setEditmode: (editmode: boolean) => void;
  orgData: organizationDataType;
  setOrgData: (orgData: organizationDataType) => void;
}) {
  const userData = useAppSelector((state) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [memberList, setMemberList] = useState<memberListType[]>([]); // 調整(顯示)用的成員列表
  const [tempMemberList, setTempMemberList] = useState<memberListType[]>([]); // 紀錄調整過程的成員列表
  const [originalMemberList, setOriginalMemberList] = useState<memberListType[]>([]); // 原始成員列表
  const [addMemberModal, setAddMemberModal] = useState(false);

  /** 更新群組成員 */
  const handleUpdateOrgMember = async () => {
    setIsLoading(true);
    const updateMemberList = memberList.filter((member) => member.isSelected);
    const newMemeberList = updateMemberList // 新增成員
      .filter((member) => !orgData.members.includes(member.uid))
      .map((member) => member.userName);
    const removeMemberList = originalMemberList // 移除成員
      .filter((member) => !updateMemberList.includes(member))
      .map((member) => member.userName);
    const result = await updateOrganizationData(
      orgData.orgId,
      userData!,
      {
        ...orgData,
        members: updateMemberList.map((member) => member.uid),
      },
      "editOrgMember",
      userData?.userName || "",
      newMemeberList,
      removeMemberList,
    );

    if (result.code === "SUCCESS") {
      setOrgData({ ...orgData, members: updateMemberList.map((member) => member.uid) });
    }
    setIsLoading(false);
    setEditmode(false);
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
    setTempMemberList(tempList);
  };

  /** 處理搜尋功能 */
  const handleSearch = (value: string) => {
    if (value.length === 0) {
      setMemberList(tempMemberList);
      return;
    }
    const tempList = tempMemberList?.filter((friend) => friend.userName.includes(value));
    setMemberList(tempList as memberListType[]);
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
    const memberList = await Promise.all(tempList) as memberListType[];
    setMemberList(memberList);
    setTempMemberList(memberList);
    setOriginalMemberList(memberList);
  };

  useEffect(() => {
    getMemberList();
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
        <div className="relative w-full">
          <h3 className="mb-5">群組成員</h3>
          <Button
            type="button"
            className="absolute top-5 left-0 bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)] text-white"
            onClick={() => setAddMemberModal(true)}
          >
            新增成員
          </Button>
        </div>
        <form className="w-full md:w-auto h-[calc(100%-100px)] md:h-[400px] flex flex-col justify-center items-start gap-2">
          <div className="w-full h-full">
            <div className="relative">
              <input
                type="text"
                className="formInput my-2 px-4"
                placeholder="搜尋成員"
                value={searchValue}
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
                    setSearchValue("");
                    handleSearch("");
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>
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
            {isLoading ? <Spinner text="更新中..." /> : "確定"}
          </button>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-screen h-screen cursor-default z-10 bg-gray-900 opacity-60" />
      {addMemberModal && (
        <AddOrgMemberModal
          orgMemberList={memberList}
          setMemberList={setMemberList}
          setAddMemberModal={setAddMemberModal}
        />
      )}
    </div>
  );
}

export default EditOrgMemberModal;
