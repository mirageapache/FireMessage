"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerFormSchema } from "@/lib/validations/authForm";
import { registerWithEmailAndPassword } from "@/lib/auth";

function RegisterPage() {
  const inputStyle = "w-80";
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    const result = registerWithEmailAndPassword(
      values.email,
      values.password,
      values.username,
    );
    console.log(result);
  }

  return (
    <div className="p-5 sm:p-10 max-w-[400px]">
      <h2>註冊</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" className={`${inputStyle}`} placeholder="請輸入E-mail" {...field} />
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
                  <Input type="password" className={`${inputStyle}`} placeholder="請輸入密碼" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    className={`${inputStyle}`}
                    placeholder="請輸入確認密碼"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" className={`${inputStyle}`} placeholder="請輸入名稱" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="btn">
            註冊
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default RegisterPage;
