"use client";

import React from "react";
import {
  Form, FormControl, FormField, FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginFormSchema } from "@/lib/validations/authForm";
import { loginWithEmailAndPassword } from "@/lib/auth";
import OAuthSection from "@/components/OAuthSection";
import { useRouter } from "next/navigation";

function LoginPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  type LoginResult =
    | { code: "SUCCESS"; message: string }
    | { code: "ERROR"; error: { code: string; message: string } };

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const result = await loginWithEmailAndPassword(values.email, values.password) as LoginResult;
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
          msg = "Email不存在";
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
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    className="authInput"
                    placeholder="請輸入E-mail"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    className="authInput"
                    placeholder="請輸入密碼"
                    {...field}
                  />
                </FormControl>
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
