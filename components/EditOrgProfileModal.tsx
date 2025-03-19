"use client";

import React, { useState } from "react";
import Image from "next/image";
import { editOrgProfileSchema } from "@/lib/validations/profileForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { updateOrganizationData } from "@/lib/organization";
import { organizationDataType } from "@/types/organizationType";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Spinner from "./Spinner";
import { Textarea } from "./ui/textarea";
import Avatar from "./Avatar";
import EditImageModal from "./EditImageModal";

function EditOrgProfileModal({
  setEditmode,
  orgData,
  cover,
  avatar,
  setOrgData,
  setCover,
  setAvatar,
}: {
  setEditmode: (editmode: boolean) => void;
  orgData: organizationDataType;
  cover: string;
  avatar: string;
  setOrgData: (orgData: organizationDataType) => void;
  setCover: (cover: string) => void;
  setAvatar: (avatar: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isCoverLoading, setIsCoverLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);

  const form = useForm<z.infer<typeof editOrgProfileSchema>>({
    resolver: zodResolver(editOrgProfileSchema),
    defaultValues: {
      organizationName: orgData?.organizationName || "",
      description: orgData?.description || "",
    },
  });

  /** 提交編輯資料 */
  const onSubmit = async (values: z.infer<typeof editOrgProfileSchema>) => {
    setIsLoading(true);

    const variable = {
      ...orgData,
      organizationName: values.organizationName,
      description: values.description,
    };

    const result = await updateOrganizationData(
      orgData?.orgId || "",
      variable,
    );
    if (result.code === "SUCCESS") {
      setEditmode(false);
      toast.success("更新成功");
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  /** 更新群組資料 */
  const updateOrgData = (result: { imageUrl: string, public_id: string }, imgType: string) => {
    if (imgType === "cover") {
      setOrgData({...orgData, coverUrl: result.imageUrl, coverPublicId: result.public_id});
    } else {
      setOrgData({...orgData, avatarUrl: result.imageUrl, avatarPublicId: result.public_id});
    }
  };

  return (
    <div className="fixed bottom-0 left-0 top-[50px] md:top-0 w-screen h-screen flex justify-center items-center z-50">
      <div className="relative w-full h-full md:max-w-[600px] md:w-2/3 md:h-auto bg-[var(--modal-bg-color)] text-[var(--text-color)] pt-12 pb-10 px-5 rounded-none md:rounded-lg shadow-lg z-20">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="關閉編輯視窗"
            className="absolute top-5 right-5"
            onClick={() => {
              Swal.fire({
                title: "確定要關閉編輯視窗嗎？",
                text: "所有未儲存的資料將會遺失",
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
        <h3 className="mb-5">編輯群組資料</h3>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* 封面 */}
            <section className="relative h-[200px] bg-[var(--image-bg-color)]">
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
                userName={orgData?.organizationName || ""}
                avatarUrl={avatar}
                classname="absolute top-[-70px] w-[100px] h-[100px] bg-[var(--card-bg-color)] left-10"
                textSize="text-3xl sm:text-5xl"
                bgColor={orgData?.bgColor || ""}
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

            {/* 表單資料 */}
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      className="formInput"
                      placeholder="群組名稱"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="inputErrorMsg"
                    style={{ margin: 0 }}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="formInput resize-none min-h-[100px]"
                      maxLength={200}
                      placeholder="設定群組簡介..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="inputErrorMsg"
                    style={{ margin: 0 }}
                  />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)]"
            >
              {isLoading ? <Spinner /> : "儲存"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="fixed top-0 left-0 w-screen h-screen cursor-default z-10 bg-gray-900 opacity-60" />
    
      {showCoverModal && (
        <EditImageModal
          orgId={orgData?.orgId}
          imgType="cover"
          userType="org"
          publicId={orgData?.coverPublicId}
          setShowImageModal={setShowCoverModal}
          setIsLoading={setIsCoverLoading}
          setImageUrl={setCover}
          handleCallBack={updateOrgData}
        />
      )}
      {showAvatarModal && (
        <EditImageModal
          orgId={orgData?.orgId}
          imgType="avatar"
          userType="org"
          publicId={orgData?.avatarPublicId}
          setShowImageModal={setShowAvatarModal}
          setIsLoading={setIsAvatarLoading}
          setImageUrl={setAvatar}
          handleCallBack={updateOrgData}
        />
      )}
    </div>
  );
}

export default EditOrgProfileModal;
