/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiResponseType } from "./api";

/** 群組資料 */
export type organizationDataType = {
  hostId: string;
  chatRoomId: string;
  orgId: string;
  organizationName: string;
  coverUrl: string;
  coverPublicId: string;
  avatarUrl: string;
  avatarPublicId: string;
  bgColor: string;
  description: string;
  members: string[];
  createdAt: string | any;
};

/** 群組資料 Response Type */
export interface organizationResponseType extends apiResponseType {
  data: organizationDataType[];
}
