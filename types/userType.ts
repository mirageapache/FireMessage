import { User } from "next-auth";

/** 使用者資料 */
export type userDataType = Omit<User, 'providerData'> & {
  uid: string;
  email: string;
  userName: string;
  userAccount: string;
  coverUrl: string;
  coverPublicId: string;
  avatarUrl: string;
  avatarPublicId: string;
  bgColor: string;
  biography: string;
  createdAt: string;
  loginType: string;
  userType: string;
  emailVerified: boolean;
  friendStatus: number;
};

/** 使用者設定 */
export type userSettingsType = {
  darkMode: string;
  toastifyPosition: string;
  themeMode: string;
  language: string;
};

/** 好友資料 */
export type friendDataType = {
  uid: string;
  status: number;
  createdAt: string;
};
