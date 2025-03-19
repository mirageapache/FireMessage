"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { deleteUserImage, deleteOrgImage, uploadOrgImage, uploadUserImage } from "@/lib/image";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";

function EditImageModal({
  orgId,
  imgType,
  userType,
  publicId,
  setShowImageModal,
  setIsLoading,
  setImageUrl,
  handleCallBack,
}: {
  orgId?: string;
  imgType: string;
  userType: string;
  publicId?: string;
  setShowImageModal: (setShowImageModal: boolean) => void;
  setIsLoading: (setIsLoading: boolean) => void;
  setImageUrl: (setImageUrl: string) => void;
  handleCallBack: (result: { imageUrl: string, public_id: string }, imgType: string) => void;
}) {
  const uid = useAppSelector((state: RootState) => state.user.userData?.uid);
  const imageType = imgType === "cover" ? "封面" : "頭貼";

  /** 上傳圖片 */
  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
    publicId: string,
  ) => {
    setIsLoading(true);
    setShowImageModal(false);
    const fileList = event.target.files;
    if (!isEmpty(fileList) && fileList?.length) {
      const file = fileList[0];
      let result;
      if (userType === "user") {
        result = await uploadUserImage(uid || "", type, publicId, file);
      } else {
        result = await uploadOrgImage(orgId!, uid || "", type, publicId, file);
      }

      if (result.code === "ERROR") {
        toast.error(result.error || "上傳失敗");
      } else {
        setImageUrl(result.imageUrl);
        handleCallBack({ imageUrl: result.imageUrl, public_id: result.public_id }, imgType); // 同步更新
        toast.success(`已更新${imageType}`);
      }
    }
    setIsLoading(false);
  };

  /** 刪除圖片 */
  const handleDeleteImage = async (type: string, publicId: string) => {
    setIsLoading(true);
    setShowImageModal(false);

    let res;
    if (userType === "user") {
      res = await deleteUserImage(uid || "", type, publicId);
    } else {
      res = await deleteOrgImage(orgId!, uid || "", type, publicId);
    }

    if (res.code === "ERROR") {
      toast.error(res.error || "刪除失敗，請稍後再試");
    } else {
      setImageUrl("");
      handleCallBack({ imageUrl: "", public_id: "" }, imgType);
      toast.success(`已移除${imageType}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-0 left-0 w-screen h-screen flex justify-center items-center z-50">
      <div className="flex flex-col justify-center items-center gap-5 w-80 bg-[var(--card-bg-color)] p-5 rounded-lg shadow-lg z-20">
        <div className="relative w-full flex justify-center items-center">
          <h4 className="text-lg">編輯{imageType}</h4>
          <button
            type="button"
            aria-label="關閉選單"
            className="absolute top-0 right-0"
            onClick={() => setShowImageModal(false)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]"
            />
          </button>
        </div>
        <input
          id="coverInput"
          type="file"
          className="hidden"
          onChange={(e) =>
            handleUploadImage(e, imgType, publicId!)
          }
        />
        <label
          aria-label="上傳圖片"
          htmlFor="coverInput"
          className="w-full text-center text-lg text-white bg-[var(--success)] rounded-lg p-2 cursor-pointer hover:shadow-lg"
        >
          上傳{imageType}
        </label>
        <button
          aria-label="刪除封面"
          type="button"
          className="w-full text-center text-lg text-white bg-[var(--error)] rounded-lg p-2 hover:shadow-lg"
          onClick={() => handleDeleteImage(imgType, publicId!)}
        >
          刪除{imageType}
        </button>
      </div>
      <button
        aria-label="關閉選單"
        type="button"
        className="fixed top-0 left-0 w-screen h-screen cursor-default z-10 bg-gray-900 opacity-60"
        onClick={() => setShowImageModal(false)}
      />
    </div>
  );
}

export default EditImageModal;
