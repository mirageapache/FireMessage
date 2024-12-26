"use client";

import React from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginFormSchema } from "@/lib/validations/authForm";
import { loginWithEmailAndPassword } from "@/lib/auth";

function LoginPage() {
  const inputStyle =
    "w-80 h-[50px] sm:h-10 text-xl sm:text-lg md:text-lg mb-[30px] rounded-[8px] bg-[var(--input-bg-color)] text-[var(--input-text-color)]";

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const result = loginWithEmailAndPassword(values.email, values.password);
    console.log(result);
  }

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
                    className={`${inputStyle}`}
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
                    className={`${inputStyle}`}
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
        </form>
      </Form>
    </div>
  );
}

export default LoginPage;
