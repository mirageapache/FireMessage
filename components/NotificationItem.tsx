import React from 'react';
import Link from 'next/link';
import { notificationDataType } from '@/types/notificationType';
import { updateNotificationIsRead } from '@/lib/notification';
import { formatDateTime } from '@/lib/utils';
import Avatar from './Avatar';

function NotificationItem({
  item,
  setShowNotificationModal,
}: {
  item: notificationDataType,
  setShowNotificationModal: (value: boolean) => void
}) {
  return (
    <Link
      href="/friend"
      className="flex justify-between items-center gap-2 hover:bg-[var(--hover-bg-color)] p-2 rounded-lg cursor-pointer"
      onClick={async () => {
        await updateNotificationIsRead(item.id);
        setShowNotificationModal(false);
      }}
    >
      <div className="flex items-center gap-2">
        <Avatar
          userName={item.sourceUserData.userName}
          avatarUrl={item.sourceUserData.avatarUrl}
          bgColor={item.sourceUserData.bgColor}
          classname="w-10 h-10"
          textSize="text-sm"
        />
        <p>
          <strong>{item.sourceUserData.userName}</strong>
          {item.content}
        </p>
        <p className="text-md text-[var(--secondary-text-color)]">{formatDateTime(item?.createdAt)}</p>
      </div>
      <div className="relative p-2">
        {!(item.isRead) && (
          <span className="block w-2 h-2 bg-[var(--brand-color)] rounded-full" />
        )}
      </div>
    </Link>
  );
}

export default NotificationItem;
