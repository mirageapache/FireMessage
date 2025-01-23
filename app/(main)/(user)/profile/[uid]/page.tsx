/* eslint-disable jsx-a11y/label-has-associated-control */

"use client";

import React from "react";
import Image from "next/image";
import moment from "moment";
import { isEmpty } from "lodash";
import { RootState } from "@/store";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { sendVerification } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import { updateUserImage } from "@/lib/image";

function Profile({ params }: { params: { uid: string } }) {
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const listItemStyle = "flex justify-between items-center";
  // const [cover, setCover] = useState(userData?.coverUrl || "");
  // const [avatar, setAvatar] = useState(userData?.avatarUrl || "");

  /** 上傳圖片 */
  const handleUploadImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
    publicId: string,
  ) => {
    const fileList = event.target.files; // 獲取選擇的檔案列表
    if (!isEmpty(fileList) && fileList?.length) {
      const file = fileList[0];
      updateUserImage(params.uid, type, publicId, file);
    }
  };

  return (
    <div>
      <section className="relative h-[200px] bg-[var(--card-bg-color)]">
        <Image src={userData?.coverUrl || ""} alt="cover" width={1200} height={200} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full">
          <input id="coverInput" type="file" className="hidden" onChange={(e) => handleUploadImage(e, 'cover', userData?.coverPublicId || "")} />
          <label htmlFor="coverInput" className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 cursor-pointer opacity-0 hover:opacity-50">
            <FontAwesomeIcon icon={faImage} size="lg" className="text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
          </label>
        </div>
      </section>
      <div className="relative h-[50px]">
        <Avatar
          userName={userData?.userName || ""}
          avatarUrl={userData?.avatarUrl || ""}
          classname="w-[100px] h-[100px] absolute top-[-70px] left-10 border"
          textSize="text-3xl sm:text-5xl"
          bgColor={userData?.bgColor || ""}
        />
        <div className="absolute top-[-70px] left-10 w-[100px] h-[100px] rounded-full">
          <input id="avatarInput" type="file" className="hidden" onChange={(e) => handleUploadImage(e, 'avatar', userData?.avatarPublicId || "")} />
          <label htmlFor="avatarInput" className="absolute top-0 left-0 w-[100px] h-[100px] rounded-full flex justify-center items-center bg-gray-800 cursor-pointer opacity-0 hover:opacity-70">
            <FontAwesomeIcon icon={faImage} size="lg" className="text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
          </label>
        </div>
      </div>
      <section className="flex flex-col gap-2 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <div className="flex justify-between items-start">
          <span className="flex justify-start items-end gap-2">
            <h2 className="text-left">{userData?.userName}</h2>
            <p className="text-[var(--secondary-text-color)]">
              @
              {userData?.userAccount}
            </p>
          </span>
          <button aria-label="編輯個人資料" type="button">
            <FontAwesomeIcon icon={faPenToSquare} size="lg" className="text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
          </button>
        </div>
        <div>
          {isEmpty(userData?.biography) ? (
            <p className="text-[var(--secondary-text-color)]">
              尚未設定個人簡介
            </p>
          ) : (
            <p className="text-[var(--text-color)]">{userData?.biography}</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-4 px-4">
        <div className={cn(listItemStyle)}>
          <p>Email</p>
          <p>{userData?.email}</p>
        </div>
        <div className={cn(listItemStyle)}>
          <p>Email認證</p>
          <span>
            {userData?.emailVerified ? "已認證" : (<i className="text-sm text-[var(--disable-text-color)]">(尚未認證)&nbsp;&nbsp;</i>)}
            {!userData?.emailVerified && (
              <Button
                disabled={userData?.emailVerified}
                className={cn(userData?.emailVerified ? "bg-[var(--secondary)]" : "bg-[var(--brand-secondary-color)]", "hover:bg-[var(--brand-color)] px-2")}
                onClick={async () => {
                  const res = await sendVerification();
                  if (res.code === "SUCCESS") {
                    toast("📨驗證信已發送，請至信箱查看");
                  } else {
                    toast("發送失敗，請稍後再試");
                  }
                }}
              >
                發送認證信
              </Button>
            )}
          </span>
        </div>
        <div className={cn(listItemStyle)}>
          <p>註冊日期</p>
          <p>{moment(userData?.createdAt).format("YYYY/MM/DD")}</p>
        </div>
      </section>
    </div>
  );
}

export default Profile;
