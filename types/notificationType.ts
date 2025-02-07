import { userDataType } from "./userType";

export type notificationDataType = {
  uid: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  content: string;
  link: string;
  sourceUserData: userDataType;
};

export type notificationResponseType = {
  code: string;
  count: number;
  data: notificationDataType[];
  error: unknown;
};
