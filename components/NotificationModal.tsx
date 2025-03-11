import React from 'react';
import Link from 'next/link';
import { notificationDataType } from '@/types/notificationType';
import { isEmpty } from 'lodash';
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
      key={item.id}
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
      <div className="mt-2 border-t border-[var(--divider-color)] text-right">
        <Link
          href="/notification"
          className="pt-2 text-[var(--secondary-text-color)] hover:text-[var(--active)] text-sm"
          onClick={() => setShowNotificationModal(false)}
        >
          查看所有通知
        </Link>
      </div>
    </div>
  );
}

export default NotificationModal;
