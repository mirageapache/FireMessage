import { notificationDataType } from '@/types/notificationType';
import { isEmpty } from 'lodash';
import React from 'react';
import NotificationItem from './NotificationItem';

function NotificationModal({
  data,
  setShowNotificationModal,
} : {
  data: notificationDataType[],
  setShowNotificationModal: (value: boolean) => void
}) {
  const notifiItem = data.map((item) => (
    <NotificationItem
      key={item.uid}
      item={item}
      setShowNotificationModal={setShowNotificationModal}
    />
  ));

  return (
    <div>
      <div className="border-b border-[var(--divider-color)] pb-2">
        <h4 className="text-left">通知</h4>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {isEmpty(data) ? (
          <h5 className="py-4">-尚無通知-</h5>
        ) : (
          <div>
            {notifiItem}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationModal;
