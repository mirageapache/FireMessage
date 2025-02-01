"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { loginFormSchema } from "@/lib/validations/authForm";
import { loginWithEmailAndPassword } from "@/lib/auth";
import OAuthSection from "@/components/OAuthSection";
import { useRouter } from "next/navigation";
import { authResponseType } from "@/types/authType";
import { authErrorHandle } from "@/lib/error";
import Spinner from "@/components/Spinner";

function LoginPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    setErrorMsg("");
    const result = (await loginWithEmailAndPassword(
      values.email,
      values.password,
    )) as authResponseType;
    if (result.code === "SUCCESS") {
      toast("歡迎回來！");
      router.push("/dashboard");
    } else {
      const msg = authErrorHandle(result.error.code);
      if (msg !== "") {
        setErrorMsg(msg);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="p-5 sm:p-10 max-w-[400px]">
      <h2 className="mb-[30px]">歡迎回來</h2>
      <Form {...form}>
        <form
          className="flex flex-col justify-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="my-[5px]">
                <FormControl>
                  <Input
                    type="email"
                    className="formInput"
                    placeholder="請輸入E-mail"
                    {...field}
                    onFocus={() => {
                      if (errorMsg) {
                        setErrorMsg("");
                      }
                    }}
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
              <FormItem className="my-[5px]">
                <FormControl>
                  <Input
                    type="password"
                    className="formInput"
                    placeholder="請輸入密碼"
                    {...field}
                    onFocus={() => {
                      if (errorMsg) {
                        setErrorMsg("");
                        form.resetField("password");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className="inputErrorMsg" style={{ margin: 0 }}>
                  {errorMsg && <p>{errorMsg}</p>}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="btn bg-[var(--brand-secondary-color)] hover:bg-[var(--brand-secondary-color)] text-white"
          >
            {isLoading ? <Spinner /> : "登入"}
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
