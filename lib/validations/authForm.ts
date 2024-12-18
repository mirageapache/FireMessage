import { z } from 'zod';

/** 註冊驗證 */
export const registerFormSchema = z.object({
  email: z.string()
    .min(1, { message: '請輸入電子郵件' })
    .email('請輸入有效的電子郵件'),
  password: z.string()
    .min(1, { message: '請輸入密碼' })
    .min(8, { message: '密碼至少 8 個字元' }),
  confirmPassword: z.string()
    .nonempty('請輸入確認密碼')
    .min(8, { message: '密碼至少 8 個字元' }),
  username: z.string()
    .nonempty('請輸入名稱'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: '與密碼不一致',
});

/** 登入驗證 */
export const loginFormSchema = z.object({
  email: z.string()
    .min(1, { message: '請輸入電子郵件' })
    .email('請輸入有效的電子郵件'),
  password: z.string()
    .min(1, { message: '請輸入密碼' })
    .min(8, { message: '密碼至少 8 個字元' }),
});
