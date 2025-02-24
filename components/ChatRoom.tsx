"use client";

import React, { useEffect, useState } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Textarea } from './ui/textarea';
import Spinner from './Spinner';

function ChatRoom() {
  const roomId = useAppSelector((state: RootState) => state.system.activeChatRoomId);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  console.log(roomId);

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

  /** 傳送訊息 */
  const handleSendMessage = async () => {
    if (message.length === 0) return;
    console.log('send message');
    // const result = await sendMessage(uid, friendUid, message);
    // console.log(result);
  };

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
                  <p className="messageItem">訊息內容</p>
                </div>
                <div className="flex justify-end items-center w-full">
                  <p className="messageItem">English content</p>
                </div>
              </div>
            </Panel>

            <PanelResizeHandle />

            {/* 訊息輸入區塊 input panel */}
            <Panel defaultSize={15} minSize={15}>
              <div className="flex justify-between items-center w-full h-full border-t border-[var(--divider-color)]">
                <Textarea
                  className="resize-none w-full h-full text-lg placeholder-gray-400 border-none"
                  maxLength={500}
                  placeholder="輸入訊息..."
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="button" className="p-2" disabled={message.length === 0} onClick={handleSendMessage}>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    size="lg"
                    className={cn(message.length > 0 ? "text-[var(--brand-color)] hover:text-[var(--active)]" : "text-[var(--disable-text-color)]")}
                  />
                </button>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
