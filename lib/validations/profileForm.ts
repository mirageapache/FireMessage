import { z } from "zod";

/** 編輯個人資料驗證 */
export const editProfileSchema = z.object({
  username: z.string()
    .nonempty('請輸入名稱'),
  account: z.string()
    .nonempty('請輸入帳號'),
  bio: z.string()
    .max(200, { message: '最多 200 個字元' }),
});
