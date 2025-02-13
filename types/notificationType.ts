import { apiResponseType } from "./api";
import { userDataType } from "./userType";
/** 通知資料 */
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

/** 即時通知資料 */
export type immediateNotiDataType = {
  fromuid: string;
  message: string;
  timestamp: string;
  type: string;
  isRead: boolean;
};

/** 通知資料 Response Type */
export interface notificationResponseType extends apiResponseType {
  unCheckedCount: number;
  data: notificationDataType[];
}
