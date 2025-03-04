/* eslint-disable @typescript-eslint/no-explicit-any */

import { userDataType } from "./userType";

/** 聊天列表訊息資料 */
export type chatDataType = {
  chatRoomId: string;
  chatRoomName: string;
  member: string[];
  type: number; // 聊天室類型 0: 好友 1: 群組
  avatarUrl: string; // 聊天室頭像
  bgColor: string; // 聊天室顏色
  lastMessage: string;
  lastMessageTime: string | any;
  unreadCount: number;
};

/** 聊天室資訊 */
export type chatRoomInfoType = {
  chatRoomId: string;
  type: number; // 聊天室類型 0:好友, 1:群組
  avatarUrl: string; // 聊天室頭像
  bgColor: string; // 聊天室顏色
  member: string[];
  createdAt: string;
};

/** 訊息資料  */
export type messageDataType = {
  messageId: string;
  message: string;
  createdAt: string | any;
  sourceUserData: userDataType;
  type: number; // 訊息類型 0: 文字 1: 圖片 2: 影片 3: 語音 4: 位置 5: 連結 6: 其他
};

/** 即時訊息資料 */
export type immediateMessageDataType = {
  member: string[];
  chatRoomId: string;
  chatRoomName: string;
  chatRoomAvatar: string;
  chatRoomBgColor: string;
  message: string;
  createdAt: string;
  type: string;
  isRead: boolean;
};
