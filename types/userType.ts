import { User } from "next-auth";

/** 使用者資料 */
export type userDataType = Omit<User, 'providerData'> & {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  loginType: string;
  createdAt: string | undefined;
  emailVerified: boolean;
};
