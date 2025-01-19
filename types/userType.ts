import { User } from "next-auth";

/** 使用者資料 */
export type userDataType = Omit<User, 'providerData'> & {
  uid: string;
  email: string | null;
  userName: string | null;
  userAccount: string | null;
  avatarUrl: string | null;
  bgColor: string;
  createdAt: string | undefined;
  loginType: string;
  userType: string;
  emailVerified: boolean;
};
