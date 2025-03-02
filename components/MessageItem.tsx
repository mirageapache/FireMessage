import React from 'react';

function MessageItem() {
  return (
    <>
      <div className="flex justify-start items-end w-full">
        <p className="messageItem right-radius max-w-[70%]">English content 2</p>
        <p className="text-sm text-[var(--disable-text-color)] dark:text-[var(--secondary-text-color)] pl-1">14:00</p>
      </div>
      <div className="flex justify-end items-end w-full">
        <p className="text-sm text-[var(--disable-text-color)] dark:text-[var(--secondary-text-color)] pr-1">12:00</p>
        <p className="messageItem left-radius max-w-[70%]">English content1</p>
      </div>
    </>
  );
}

export default MessageItem;
