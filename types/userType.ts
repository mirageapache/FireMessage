import { User } from "next-auth";

/** 使用者資料 */
export type userDataType = Omit<User, 'providerData'> & {
  uid: string;
  email: string;
  userName: string;
  userAccount: string;
  avatarUrl: string;
  bgColor: string;
  coverUrl: string;
  biography: string;
  createdAt: string;
  loginType: string;
  userType: string;
  emailVerified: boolean;
};

/** 使用者設定 */
export type userSettingsType = {
  darkMode: string;
  toastifyPosition: string;
  themeMode: string;
  language: string;
};
