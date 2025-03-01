"use client";

import React, { useEffect, useState } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { setActiveChatRoomId } from '@/store/chatSlice';
import { Textarea } from './ui/textarea';
import Spinner from './Spinner';
import MessageItem from './MessageItem';

function ChatRoom() {
  const roomId = useAppSelector((state: RootState) => state.chat.activeChatRoomId);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

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
        <div className="relative h-full">
          <PanelGroup direction="vertical">
            <Panel defaultSize={85} minSize={60}>
              {/* 頁首區塊 header */}
              <div className="absolute top-0 left-0 flex justify-start items-center w-full h-[50px] border-b border-[var(--divider-color)] rounded-tr-lg px-2 bg-[var(--card-bg-color)] z-20">
                <button type="button" className="p-1" onClick={() => dispatch(setActiveChatRoomId(""))}>
                  <FontAwesomeIcon icon={faAngleLeft} size="lg" className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
                </button>
                <p className="text-lg w-full text-center text-xl">User Name</p>
              </div>

              {/* 訊息顯示區塊 message panel */}
              <div className="h-[calc(100%-50px)] overflow-y-auto mt-[50px] p-5 flex flex-col-reverse">
                <div className="flex flex-col gap-2">
                  <MessageItem />
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
                <button type="button" className="p-4" disabled={message.length === 0} onClick={handleSendMessage}>
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
