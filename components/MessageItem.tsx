import React from 'react';
import { messageDataType } from '@/types/chatType';
import { cn, formatDateTime } from '@/lib/utils';

function MessageItem({
  message,
  createdAt,
  isOwner,
}: messageDataType) {
  return (
    <div className={cn("flex justify-start items-end w-full", isOwner ? "justify-end" : "justify-start")}>
      {isOwner ? (
        <>
          <p className="text-sm text-[var(--disable-text-color)] dark:text-[var(--secondary-text-color)] pr-1">{formatDateTime(createdAt)}</p>
          <p className="messageItem left-radius max-w-[70%]">{message}</p>
        </>
      ) : (
        <>
          <p className="messageItem right-radius max-w-[70%]">{message}</p>
          <p className="text-sm text-[var(--disable-text-color)] dark:text-[var(--secondary-text-color)] pl-1">{formatDateTime(createdAt)}</p>
        </>
      )}
    </div>
  );
}

export default MessageItem;
