"use client";

import React, { useState } from 'react';
import { editProfileSchema } from '@/lib/validations/profileForm';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUserData } from '@/lib/user';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { setUser } from '@/store/userSlice';
import { userDataType } from '@/types/userType';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Spinner from './Spinner';
import { Textarea } from './ui/textarea';

function EditProfileModal({ setEditmode }: { setEditmode: (editmode: boolean) => void }) {
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: userData?.userName || "",
      account: userData?.userAccount || "",
      bio: userData?.biography || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    setIsLoading(true);
    const result = (await updateUserData(
      userData?.uid || "",
      values.username,
      values.account,
      values.bio,
    ));
    if (result.code === "SUCCESS") {
      dispatch(setUser({
        ...userData,
        userName: values.username,
        userAccount: values.account,
        biography: values.bio,
      } as userDataType));
      setEditmode(false);
      toast.success("更新成功");
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-0 left-0 w-screen h-screen flex justify-center items-center z-50">
      <div className="relative w-full h-full md:max-w-[600px] md:w-2/3 md:h-auto bg-[var(--modal-bg-color)] text-[var(--text-color)] pt-12 pb-10 px-5 rounded-lg shadow-lg z-20">
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
            <FontAwesomeIcon icon={faXmark} size="lg" className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
          </button>
        </div>
        <h3 className="mb-5">編輯個人資料</h3>
        <Form {...form}>
          <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" className="formInput" placeholder="暱稱" {...field} />
                  </FormControl>
                  <FormMessage className="inputErrorMsg" style={{ margin: 0 }} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" className="formInput" placeholder="帳號" {...field} />
                  </FormControl>
                  <FormMessage className="inputErrorMsg" style={{ margin: 0 }} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="formInput resize-none min-h-[100px]"
                      maxLength={200}
                      placeholder="設定個人簡介..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="inputErrorMsg" style={{ margin: 0 }} />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-color)]">
              {isLoading ? <Spinner /> : "儲存"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="fixed top-0 left-0 w-screen h-screen cursor-default z-10 bg-gray-900 opacity-60" />
    </div>
  );
}

export default EditProfileModal;
