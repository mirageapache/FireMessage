"use client";

/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import { getOrganizationDetail } from "@/lib/organization";
import { organizationDataType } from "@/types/organizationType";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import Image from "next/image";

function OrganizationProfile({ params }: { params: { id: string } }) {
  const orgId = params.id;
  const [orgData, setOrgData] = useState<organizationDataType>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const listItemStyle = "flex justify-between items-center";

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
          <p className="text-[var(--secondary-text-color)]">
            尚未設定群組簡介
          </p>
          {/* {isEmpty(orgData?.description) ? (
            <p className="text-[var(--secondary-text-color)]">
              尚未設定群組簡介
            </p>
          ) : (
            <p className="text-[var(--text-color)] whitespace-pre-wrap">
              {orgData?.description}
            </p>
          )} */}
        </div>
        <div className="text-right">
          {/* {orgData?.friendStatus === 0 && (
            <Button
              type="button"
              aria-label="發送好友邀請"
              className="w-full sm:w-auto bg-[var(--success)] hover:bg-[var(--success-hover)]"
              onClick={async () => {
                const reuslt = await createFriendRequest(currentUid || "", params.uid);
                if (reuslt.code === "SUCCESS") {
                  toast.success(reuslt.message);
                  handleGetorgData();
                } else {
                  toast.error(reuslt.message);
                }
              }}
            >
              發送好友邀請
            </Button>
          )} */}
          {/* {orgData?.friendStatus === 1 && (
            <Button
              type="button"
              disabled
              className="w-full sm:w-auto bg-[var(--disable)]"
            >
              已發送好友邀請
            </Button>
          )} */}
          <Button
            type="button"
            aria-label="編輯群組"
            className="w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
          >
            編輯群組
          </Button>
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
        <Button type="button" className="w-full sm:w-auto bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)]" onClick={() => router.push("/dashboard")}>返回</Button>
      </section>
    </div>
  );
}

export default OrganizationProfile;
