/* eslint-disable @typescript-eslint/no-explicit-any */

import { userDataType } from "./userType";

/** 聊天列表資訊 */
export type chatListInfoType = {
  chatRoomId: string;
  type: number; // 聊天室類型 0: 好友 1: 群組
  members: string[]; // 聊天室成員
  chatRoomName: string; // 如果為好友則為對方名字，如果為群組則為群組名稱
  avatarUrl: string; // 如果為好友則為對方頭像，如果為群組則為群組頭像
  bgColor: string; // 聊天室顏色
  lastMessage: string;
  lastMessageTime: string | any;
  createdAt: string | any;
  unreadCount: number;
};

/** 聊天室資訊 */
export type chatRoomInfoType = {
  chatRoomId: string;
  type: number; // 聊天室類型 0:好友, 1:群組
  avatarUrl: string; // 聊天室頭像
  bgColor: string; // 聊天室顏色
  member: string[];
  createdAt: any;
};

/** 訊息資料  */
export type messageDataType = {
  messageId: string;
  message: string;
  createdAt: string | any;
  isOwner: boolean; // 用來判斷是否為自己發送的訊息
  senderData: userDataType;
  type: string; // 訊息類型 (text, image, file...)
};

/** 即時訊息資料 */
export type immediateMessageDataType = {
  member: string[];
  fromUid: string;
  chatRoomId: string;
  chatRoomName: string;
  chatRoomAvatar: string;
  chatRoomBgColor: string;
  chatRoomType: number;
  message: string;
  createdAt: string;
  type: string;
  isRead: boolean;
};
