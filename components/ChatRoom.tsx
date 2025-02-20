"use client";

import React, { useEffect, useState } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
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

  // if (roomId === "") {
  //   return (
  //     <div className="flex justify-center items-center h-full">
  //       <p className="text-2xl">開始聊天吧！</p>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="h-full">
          <PanelGroup direction="vertical">
            {/* 訊息顯示區塊 message panel */}
            <Panel defaultSize={85} minSize={60}>
              <div className="flex justify-end items-center flex-col gap-2 h-full overflow-y-auto p-5">
                <div className="flex justify-start items-center w-full">
                  <p className="border rounded-lg p-2">訊息內容1</p>
                </div>
                <div className="flex justify-end items-center w-full">
                  <p className="border rounded-lg p-2">訊息內容2</p>
                </div>
              </div>
            </Panel>

            <PanelResizeHandle />

            {/* 訊息輸入區塊 input panel */}
            <Panel defaultSize={15} minSize={15}>
              <div className="w-full h-full border-t border-[var(--divider-color)]">
                <Textarea
                  className="resize-none w-full h-full text-lg placeholder-gray-500 dark:placeholder-gray-400 border"
                  maxLength={500}
                  placeholder="輸入訊息..."
                />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
