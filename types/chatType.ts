/* eslint-disable @typescript-eslint/no-explicit-any */

import { userDataType } from "./userType";

/** 訊息資料 */
export type chatDataType = {
  uid: string;
  userName: string;
  avatarUrl: string;
  bgColor: string;
  chatRoomId: string;
  lastMessage: string;
  lastMessageTime: string | any;
  unreadCount: number;
  sourceUserData: userDataType;
};

/** 聊天室資訊 */
export type chatRoomInfoType = {
  chatRoomId: string;
  type: number; // 聊天室類型 0: 好友 1: 群組
  member: string[];
  createdAt: string;
};
