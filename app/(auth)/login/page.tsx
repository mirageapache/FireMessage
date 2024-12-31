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
import { toast } from "react-toastify";
import { loginFormSchema } from "@/lib/validations/authForm";
import { loginWithEmailAndPassword } from "@/lib/auth";
import OAuthSection from "@/components/OAuthSection";
import { useRouter } from "next/navigation";
import { authResponse } from "@/types/authType";

function LoginPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const result = (await loginWithEmailAndPassword(
      values.email,
      values.password,
    )) as authResponse;
    if (result.code === "SUCCESS") {
      toast("登入成功！");
      router.push("/dashboard");
    } else {
      let msg = "";
      switch (result.error.code) {
        case "auth/invalid-credential":
          msg = "Email不存在或密碼錯誤";
          break;
        default:
          msg = "登入失敗";
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
      <h2 className="mb-[30px]">歡迎回來</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="my-[20px]">
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
              <FormItem className="my-[20px]">
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
          <Button
            type="submit"
            className="btn bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-secondary-color)] text-white"
          >
            登入
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/")}
            className="btn mt-[20px] bg-white hover:bg-white text-gray-500"
          >
            返回
          </Button>
        </form>
      </Form>
      <OAuthSection />
    </div>
  );
}

export default LoginPage;
