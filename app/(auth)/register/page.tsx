"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerFormSchema } from "@/lib/validations/authForm";
import { registerWithEmailAndPassword } from "@/lib/auth";
import { useRouter } from "next/navigation";
import OAuthSection from "@/components/OAuthSection";
import { authResponse } from "@/types/authType";

function RegisterPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    const result = (await registerWithEmailAndPassword(
      values.email,
      values.password,
      values.username,
    )) as authResponse;
    if (result.code === "SUCCESS") {
      Swal.fire({
        title: "註冊成功",
        icon: "success",
        confirmButtonText: "確定",
      }).then(() => {
        router.push("/login");
      });
    } else {
      let msg = "";
      switch (result.error.code) {
        case "auth/email-already-in-use":
          msg = "Email已存在";
          break;
        default:
          msg = "註冊失敗";
          break;
      }

      Swal.fire({
        title: msg,
        icon: "error",
        confirmButtonText: "確定",
      });
    }
  };

  return (
    <div className="p-5 sm:p-10 max-w-[400px]">
      <h2 className="mb-[15px]">註冊成為會員</h2>
      <Form {...form}>
        <form
          className="flex flex-col items-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="my-[10px]">
                <FormControl>
                  <Input
                    type="email"
                    className="authInput"
                    placeholder="請輸入E-mail"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="inputErrorMsg" style={{ margin: 0 }} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="my-[10px]">
                <FormControl>
                  <Input
                    type="password"
                    className="authInput"
                    placeholder="請輸入密碼"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="inputErrorMsg" style={{ margin: 0 }} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="my-[10px]">
                <FormControl>
                  <Input
                    type="password"
                    className="authInput"
                    placeholder="請輸入確認密碼"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="inputErrorMsg" style={{ margin: 0 }} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="my-[10px]">
                <FormControl>
                  <Input
                    type="text"
                    className="authInput"
                    placeholder="請輸入名稱"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="inputErrorMsg" style={{ margin: 0 }} />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="btn my-[10px] bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-secondary-color)] text-white"
          >
            註冊
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/")}
            className="btn my-[10px] bg-white hover:bg-white text-gray-500"
          >
            返回
          </Button>
        </form>
      </Form>
      <OAuthSection />
    </div>
  );
}

export default RegisterPage;
