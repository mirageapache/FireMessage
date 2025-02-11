import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { notificationDataType } from '@/types/notificationType';
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
      onClick={() => {
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
      </div>
      <div className="">
        <p>{moment(item?.createdAt).format("MM/DD")}</p>
      </div>
    </Link>
  );
}

export default NotificationItem;
