'use client';

import React, { useEffect, useState } from 'react';
import { notificationDataType, notificationResponseType } from '@/types/notificationType';
import { getNotification } from '@/lib/notification';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { isEmpty } from 'lodash';
import NotificationItem from '@/components/NotificationItem';
import ItemLoading from '@/components/ItemLoading';

function Notification() {
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const [notificationData, setNotificationData] = useState<notificationDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /** 取得通知訊息 */
  const handleGetNotification = async () => {
    setIsLoading(true);
    const res = await getNotification(userData?.uid || "", 10) as unknown as notificationResponseType;
    if (res.code === "SUCCESS") setNotificationData(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (userData?.uid) handleGetNotification();
  }, [userData?.uid]);

  const notifiItem = notificationData.map((item) => (
    <NotificationItem
      key={item.id}
      item={item}
      setShowNotificationModal={() => {}}
    />
  ));

  return (
    <div className="relative pt-3 sm:px-5">
      <div className="m-2">
        <h4 className="my-1">通知</h4>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <ItemLoading />
          <ItemLoading />
          <ItemLoading />
        </div>
      ) : (
        <div className="flex flex-col gap-2 m-2">
          {isEmpty(notificationData) ? (
            <h5 className="py-4">-尚無通知-</h5>
          ) : (
            <div>
              {notifiItem}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notification;
