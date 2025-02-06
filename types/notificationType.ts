export type notificationDataType = {
  uid: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  content: string;
  link: string;
};

export type notificationResponseType = {
  code: string;
  count: number;
  data: notificationDataType[];
};
