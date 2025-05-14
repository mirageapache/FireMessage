"use client";

/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import { getOrganizationDetail } from "@/lib/organization";
import { organizationDataType } from "@/types/organizationType";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useAppSelector } from "@/store/hooks";
import EditOrgProfileModal from "@/components/EditOrgProfileModal";
import EditOrgMemberModal from "@/components/EditOrgMemberModal";

function OrganizationProfile({ params }: { params: { id: string } }) {
  const orgId = params.id;
  const userData = useAppSelector((state) => state.user.userData);
  const router = useRouter();
  const listItemStyle = "flex justify-between items-center";
  const [orgData, setOrgData] = useState<organizationDataType>();
  const [cover, setCover] = useState(orgData?.coverUrl || "");
  const [avatar, setAvatar] = useState(orgData?.avatarUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editMemberMode, setEditMemberMode] = useState(false);

  /** 取得群組列表資料 */
  const handleGetOrgList = async () => {
    setIsLoading(true);
    const result = await getOrganizationDetail(orgId!);
    if (result.code === "SUCCESS") {
      setOrgData(result.data as unknown as organizationDataType);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (orgData) {
      setCover(orgData?.coverUrl || "");
      setAvatar(orgData?.avatarUrl || "");
    }
  }, [orgData]);

  useEffect(() => {
    if (orgId) handleGetOrgList();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div>
      {/* 封面 */}
      <section className="relative h-[200px] bg-[var(--image-bg-color)]">
        {(orgData && orgData?.coverUrl && orgData?.coverUrl !== "") && (
          <Image
            src={orgData?.coverUrl || ""}
            alt="cover"
            width={1200}
            height={200}
            className="w-full h-full object-cover"
          />
        )}
      </section>

      {/* 頭貼 */}
      <section className="relative h-[50px] z-10">
        <Avatar
          userName={orgData?.organizationName || ""}
          avatarUrl={orgData?.avatarUrl || ""}
          classname="absolute top-[-70px] w-[100px] h-[100px] bg-[var(--card-bg-color)] left-10"
          textSize="text-3xl sm:text-5xl"
          bgColor={orgData?.bgColor || ""}
        />
      </section>

      {/* 群組資料 */}
      <section className="flex flex-col gap-2 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <div className="flex justify-between items-start">
          <span className="flex justify-start items-end gap-2">
            <h2 className="text-left">{orgData?.organizationName}</h2>
          </span>
        </div>
        <div>
          {orgData?.description ? (
            <p className="text-[var(--text-color)] whitespace-pre-wrap">
              {orgData?.description}
            </p>
          ) : (
            <p className="text-[var(--secondary-text-color)]">
              尚未設定群組簡介
            </p>
          )}
        </div>
        <div className="flex justify-end items-center gap-1">
          {orgData?.members.includes(userData!.uid) ? (
            <>
              <Button
                type="button"
                aria-label="編輯群組"
                className="w-full sm:w-auto text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                onClick={() => setEditMode(true)}
              >
                編輯群組
              </Button>
              <Button
                type="button"
                aria-label="編輯成員"
                className="w-full sm:w-auto text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                onClick={() => setEditMemberMode(true)}
              >
                成員
              </Button>
              <Button
                type="button"
                aria-label="退出群組"
                className="w-full sm:w-auto text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                onClick={() => setEditMemberMode(true)}
              >
                退出群組
              </Button>
            </>
          ) : (
            <p className="text-[var(--secondary-text-color)]">尚未加入此群組</p>
          )}
        </div>
      </section>

      {/* 詳細資訊 */}
      <section className="flex flex-col gap-4 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <h5 className="sm:text-left">詳細資訊</h5>
        <div className={cn(listItemStyle)}>
          <p>成員人數</p>
          <p>{orgData?.members.length}</p>
        </div>
        <div className={cn(listItemStyle)}>
          <p>建立日期</p>
          <p>{moment(orgData?.createdAt).format("YYYY/MM/DD")}</p>
        </div>
      </section>

      {/* 返回 */}
      <section className="flex justify-center items-center pb-5 px-4">
        <Button type="button" className="w-full sm:w-60 bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)]" onClick={() => router.back()}>返回</Button>
      </section>

      {/* 修改群組資料modal */}
      {editMode && (
        <EditOrgProfileModal
          setEditmode={setEditMode}
          orgData={orgData!}
          cover={cover}
          avatar={avatar}
          setOrgData={setOrgData}
          setCover={setCover}
          setAvatar={setAvatar}
        />
      )}

      {/* 修改群組成員modal */}
      {editMemberMode && (
        <EditOrgMemberModal
          setEditmode={setEditMemberMode}
          orgData={orgData!}
          setOrgData={setOrgData}
        />
      )}
    </div>
  );
}

export default OrganizationProfile;
