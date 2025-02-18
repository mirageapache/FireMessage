"use client";

import React, { useEffect, useState } from 'react';
import { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { Textarea } from './ui/textarea';
import Spinner from './Spinner';

function ChatRoom() {
  const roomId = useAppSelector((state: RootState) => state.system.activeChatRoomId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 取得聊天室資料
    setIsLoading(false);
  }, [roomId]);

  if (roomId === "") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-2xl">開始聊天吧！</p>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {/* 訊息顯示區塊 message panel */}
          <div className="flex justify-center items-center flex-col gap-2">
            <div className="flex justify-start items-center w-full">
              <p className="border rounded-lg p-2">訊息內容1</p>
            </div>
            <div className="flex justify-end items-center w-full">
              <p className="border rounded-lg p-2">訊息內容2</p>
            </div>
          </div>

          {/* 訊息輸入區塊 input panel */}
          <div className="w-full border-t border-[var(--divider-color)]">
            <Textarea
              className="formInput resize-none w-full min-h-[100px]"
              maxLength={500}
              cols={10}
              placeholder="輸入訊息..."
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
