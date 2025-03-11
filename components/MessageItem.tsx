import React from 'react';
import { messageDataType } from '@/types/chatType';
import moment from 'moment';
import { cn } from '@/lib/utils';
import Avatar from './Avatar';

function MessageItem({
  message,
  createdAt,
  isOwner,
  senderData,
}: messageDataType) {
  return (
    <div className={cn("flex justify-start items-end w-full", isOwner ? "justify-end" : "justify-start")}>
      {isOwner ? (
        <>
          <p className="text-sm text-[var(--disable-text-color)] dark:text-[var(--secondary-text-color)] pr-1">{moment(createdAt).format("HH:mm")}</p>
          <p className="messageItem left-radius max-w-[70%]">{message}</p>
        </>
      ) : (
        <>
          <Avatar
            userName={senderData.userName}
            avatarUrl={senderData.avatarUrl}
            classname="w-10 h-10 mr-2"
            textSize="text-sm"
            bgColor={senderData.bgColor}
          />
          <p className="messageItem right-radius max-w-[70%]">{message}</p>
          <p className="text-sm text-[var(--disable-text-color)] dark:text-[var(--secondary-text-color)] pl-1">{moment(createdAt).format("H:mm")}</p>
        </>
      )}
    </div>
  );
}

export default MessageItem;
