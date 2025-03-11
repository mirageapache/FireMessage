/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiResponseType } from "./api";
import { userDataType } from "./userType";

/** 好友狀態資料 */
export type friendStatusDataType = {
  uid: string;
  status: number;
  createdAt: any;
  sourceUserData: userDataType;
};

/** 好友資料 */
export type friendDataType = {
  uid: string;
  userName: string;
  userAccount: string;
  avatarUrl: string;
  bgColor: string;
  status: number;
  chatRoomId: string;
  createdAt: string | any;
  sourceUserData: userDataType;
};

/** 好友資料 Response Type */
export interface friendResponseType extends apiResponseType {
  data: friendDataType[];
}
