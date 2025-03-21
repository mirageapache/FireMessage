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

/** 編輯群組資料驗證 */
export const editOrgProfileSchema = z.object({
  organizationName: z.string()
    .nonempty('請輸入群組名稱'),
  description: z.string()
    .max(200, { message: '最多 200 個字元' }),
});
