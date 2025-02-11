/* eslint-disable jsx-a11y/label-has-associated-control */

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { isEmpty } from "lodash";
import { RootState } from "@/store";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { sendVerification } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import { deleteUserImage, uploadImage } from "@/lib/image";
import { setUser } from "@/store/userSlice";
import { userDataType } from "@/types/userType";
import Spinner from "@/components/Spinner";
import EditProfileModal from "@/components/EditProfileModal";

function Profile() {
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const listItemStyle = "flex justify-between items-center";
  const [editmode, setEditmode] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isCoverLoading, setIsCoverLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [cover, setCover] = useState(userData?.coverUrl || "");
  const [avatar, setAvatar] = useState(userData?.avatarUrl || "");
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    setCover(userData?.coverUrl || "");
    setAvatar(userData?.avatarUrl || "");
  }, [userData]);

  /** 上傳圖片 */
  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
    publicId: string,
  ) => {
    if (type === "cover") {
      setIsCoverLoading(true);
      setShowCoverModal(false);
    } else {
      setIsAvatarLoading(true);
      setShowAvatarModal(false);
    }

    const fileList = event.target.files;
    if (!isEmpty(fileList) && fileList?.length) {
      const file = fileList[0];
      const result = await uploadImage(userData?.uid || "", type, publicId, file);
      if (result.code === "ERROR") {
        toast.error(result.error || "上傳失敗");
      } else {
        if (type === "cover") {
          setCover(result.imageUrl);
          dispatch(setUser({
            ...userData,
            coverUrl: result.imageUrl || "",
            coverPublicId: result.public_id || "",
          } as userDataType));
        } else {
          setAvatar(result.imageUrl);
          dispatch(setUser({
            ...userData,
            avatarUrl: result.imageUrl || "",
            avatarPublicId: result.public_id || "",
          } as userDataType));
        }
        toast.success(`已更新${type === "cover" ? "封面" : "頭貼"}`);
      }
    }
    setIsCoverLoading(false);
    setIsAvatarLoading(false);
  };

  /** 刪除圖片 */
  const handleDeleteImage = async (type: string, publicId: string) => {
    if (type === "cover") {
      setIsCoverLoading(true);
      setShowCoverModal(false);
    } else {
      setIsAvatarLoading(true);
      setShowAvatarModal(false);
    }

    const res = await deleteUserImage(userData?.uid || "", type, publicId);
    if (res.code === "ERROR") {
      toast.error(res.error || "刪除失敗，請稍後再試");
    } else {
      if (type === "cover") {
        setCover("");
        dispatch(setUser({
          ...userData,
          coverUrl: "",
          coverPublicId: "",
        } as userDataType));
      } else {
        setAvatar("");
        dispatch(setUser({
          ...userData,
          avatarUrl: "",
          avatarPublicId: "",
        } as userDataType));
      }
      toast.success(`已移除${type === "cover" ? "封面" : "頭貼"}`);
    }
    setIsCoverLoading(false);
    setIsAvatarLoading(false);
  };

  return (
    <>
      {/* 封面 */}
      <section className="relative h-[200px] bg-[var(--modal-bg-color)]">
        {(cover || cover !== "") && (
          <Image
            src={cover}
            alt="cover"
            width={1200}
            height={200}
            className="w-full h-full object-cover"
          />
        )}
        {isCoverLoading
          ? (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white animate-pulse bg-gray-800 opacity-70">
              <Spinner text="更新中..." />
            </div>
          )
          : (
            <div className="absolute top-0 left-0 w-full h-full">
              <button
                type="button"
                className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 opacity-0 hover:opacity-50"
                onClick={() => setShowCoverModal(true)}
              >
                <FontAwesomeIcon
                  icon={faImage}
                  size="lg"
                  className="text-[var(--brand-secondary-color)]"
                />
              </button>
            </div>
          )}
      </section>

      {/* 頭貼 */}
      <section className="relative h-[50px] z-10">
        <Avatar
          userName={userData?.userName || ""}
          avatarUrl={avatar}
          classname="absolute top-[-70px] w-[100px] h-[100px] bg-[var(--card-bg-color)] left-10"
          textSize="text-3xl sm:text-5xl"
          bgColor={userData?.bgColor || ""}
        />
        <div className="absolute top-[-70px] left-10 w-[100px] h-[100px] rounded-full z-10">
          {isAvatarLoading
            ? (
              <div className="absolute top-0 left-0 w-[100px] h-[100px] rounded-full flex justify-center items-center text-white animate-pulse bg-gray-800 opacity-70">
                <Spinner text=" " />
              </div>
            )
            : (
              <button
                type="button"
                className="absolute top-0 left-0 w-[100px] h-[100px] rounded-full flex justify-center items-center bg-gray-800 cursor-pointer opacity-0 hover:opacity-70"
                onClick={() => setShowAvatarModal(true)}
              >
                <FontAwesomeIcon
                  icon={faImage}
                  size="lg"
                  className="text-[var(--brand-secondary-color)]"
                />
              </button>
            )}
        </div>
      </section>

      {/* 個人資料 */}
      <section className="flex flex-col gap-2 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <div className="flex justify-between items-start">
          <span className="flex justify-start items-end gap-2">
            <h2 className="text-left">{userData?.userName}</h2>
            <p className="text-[var(--secondary-text-color)]">
              @
              {userData?.userAccount}
            </p>
          </span>
          <button aria-label="編輯個人資料" type="button" onClick={() => setEditmode(true)}>
            <FontAwesomeIcon
              icon={faPenToSquare}
              size="lg"
              className="text-[var(--secondary-text-color)] hover:text-[var(--active)]"
            />
          </button>
        </div>
        <div>
          {isEmpty(userData?.biography) ? (
            <p className="text-[var(--secondary-text-color)]">
              尚未設定個人簡介
            </p>
          ) : (
            <p className="text-[var(--text-color)] whitespace-pre-wrap">
              {userData?.biography}
            </p>
          )}
        </div>
      </section>

      {/* 詳細資訊 */}
      <section className="flex flex-col gap-4 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <h5 className="sm:text-left">詳細資訊</h5>
        <div className={cn(listItemStyle)}>
          <p>Email</p>
          <p>{userData?.email}</p>
        </div>
        <div className={cn(listItemStyle)}>
          <p>Email認證</p>
          <span>
            {userData?.emailVerified ? (
              "已認證"
            ) : (
              <i className="text-sm text-[var(--disable-text-color)]">
                (尚未認證)&nbsp;&nbsp;
              </i>
            )}
            {!userData?.emailVerified && (
              <Button
                disabled={userData?.emailVerified}
                className={cn(
                  userData?.emailVerified
                    ? "bg-[var(--secondary)]"
                    : "bg-[var(--brand-secondary-color)]",
                  "hover:bg-[var(--brand-color)] px-2",
                )}
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

      {/* 設定 */}
      <section className="flex flex-col gap-4 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <h5 className="sm:text-left">設定</h5>
        <div className={cn(listItemStyle)}>
          <p>好友管理</p>
          <p>開啟</p>
        </div>
        <div className={cn(listItemStyle)}>
          <p>語言</p>
          <p>繁體中文</p>
        </div>
        <div className={cn(listItemStyle)}>
          <p>提示訊息位置</p>
          <p>中間上方</p>
        </div>
        <div className={cn(listItemStyle)}>
          <p>版面</p>
          <p>預設</p>
        </div>
      </section>

      {/* 刪除帳號 */}
      <section className="flex flex-col gap-4 mb-4 pb-4 px-4">
        <div className="flex justify-between items-center">
          <p>刪除帳號</p>
          <Button type="button" disabled className="bg-[var(--error)]">刪除帳號</Button>
        </div>
      </section>

      {/* 返回 */}
      <section className="flex justify-center items-center pb-5 px-4">
        <Button type="button" className="w-full sm:w-auto bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)]" onClick={() => router.push("/dashboard")}>返回</Button>
      </section>

      {/* 修改個人資料modal */}
      {editmode && (
        <EditProfileModal setEditmode={setEditmode} />
      )}
      {/* 修改封面modal */}
      {showCoverModal && (
        <div className="fixed bottom-0 left-0 w-screen h-screen flex justify-center items-center z-50">
          <div className="flex flex-col justify-center items-center gap-5 w-80 bg-[var(--card-bg-color)] p-5 rounded-lg shadow-lg z-20">
            <div className="relative w-full flex justify-center items-center">
              <h4 className="text-lg">編輯封面</h4>
              <button type="button" aria-label="關閉封面選單" className="absolute top-0 right-0" onClick={() => setShowCoverModal(false)}>
                <FontAwesomeIcon icon={faXmark} size="lg" className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
              </button>
            </div>
            <input
              id="coverInput"
              type="file"
              className="hidden"
              onChange={(e) => handleUploadImage(e, "cover", userData?.coverPublicId || "")}
            />
            <label aria-label="上傳封面" htmlFor="coverInput" className="w-full text-center text-lg text-white bg-[var(--success)] rounded-lg p-2 cursor-pointer hover:shadow-lg">上傳封面</label>
            <button
              aria-label="刪除封面"
              type="button"
              className="w-full text-center text-lg text-white bg-[var(--error)] rounded-lg p-2 hover:shadow-lg"
              onClick={() => handleDeleteImage("cover", userData?.coverPublicId || "")}
            >
              刪除封面
            </button>
          </div>
          <button
            aria-label="關閉封面選單"
            type="button"
            className="fixed top-0 left-0 w-screen h-screen cursor-default z-10 bg-gray-900 opacity-60"
            onClick={() => setShowCoverModal(false)}
          />
        </div>
      )}
      {/* 修改頭貼modal */}
      {showAvatarModal && (
        <div className="fixed bottom-0 left-0 w-screen h-screen flex justify-center items-center z-50">
          <div className="flex flex-col justify-center items-center gap-5 w-80 bg-[var(--card-bg-color)] text-white p-5 rounded-lg shadow-lg z-20">
            <div className="relative w-full flex justify-center items-center">
              <h4 className="text-lg">編輯頭貼</h4>
              <button type="button" aria-label="關閉頭貼選單" className="absolute top-0 right-0" onClick={() => setShowAvatarModal(false)}>
                <FontAwesomeIcon icon={faXmark} size="lg" className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
              </button>
            </div>
            <input
              id="avatarInput"
              type="file"
              className="hidden"
              onChange={(e) => handleUploadImage(e, "avatar", userData?.avatarPublicId || "")}
            />
            <label aria-label="上傳頭貼" htmlFor="avatarInput" className="w-full text-center text-lg text-white bg-[var(--success)] rounded-lg p-2 cursor-pointer hover:shadow-lg">上傳頭貼</label>
            <button
              aria-label="刪除頭貼"
              type="button"
              className="w-full text-center text-lg text-white bg-[var(--error)] rounded-lg p-2 hover:shadow-lg"
              onClick={() => handleDeleteImage("avatar", userData?.avatarPublicId || "")}
            >
              刪除頭貼
            </button>
          </div>
          <button
            aria-label="關閉頭貼選單"
            type="button"
            className="fixed top-0 left-0 w-screen h-screen cursor-default z-10 bg-gray-900 opacity-60"
            onClick={() => setShowAvatarModal(false)}
          />
        </div>
      )}
    </>
  );
}

export default Profile;
