import { userDataType } from "./userType";

export type notificationDataType = {
  id: string;
  uid: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  content: string;
  link: string;
  sourceUserData: userDataType;
  isChecked: boolean;
};

export type notificationResponseType = {
  code: string;
  unCheckedCount: number;
  data: notificationDataType[];
  error: unknown;
};
