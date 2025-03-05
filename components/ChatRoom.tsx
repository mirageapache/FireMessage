"use client";

import React, { useEffect, useState } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearActiveChatRoom } from '@/store/chatSlice';
import { useMessage } from '@/hooks/useMessage';
import { getMessages, sendMessage } from '@/lib/chat';
import { messageDataType } from '@/types/chatType';
import { Textarea } from './ui/textarea';
import Spinner from './Spinner';
import MessageItem from './MessageItem';

function ChatRoom() {
  const roomInfo = useAppSelector((state: RootState) => state.chat.activeChatRoom);
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const uid = useAppSelector((state: RootState) => state.user.userData?.uid);

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<messageDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  /** 取得聊天室訊息資料 */
  const handleGetMessage = async () => {
    setIsLoading(true);
    if (!roomInfo?.chatRoomId) return;
    const result = await getMessages(roomInfo.chatRoomId, uid!);
    if (result.code === "success") {
      setMessageList(result.messageData as messageDataType[]);
    }
    setIsLoading(false);
  };

  // 監聽即時訊息
  useMessage(uid!, handleGetMessage);

  useEffect(() => {
    handleGetMessage();
  }, [roomInfo?.chatRoomId]);

  if (!roomInfo) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-2xl">開始聊天吧！</p>
      </div>
    );
  }

  /** 傳送訊息 */
  const handleSendMessage = async () => {
    if (message.length < 1) return;
    const result = await sendMessage(roomInfo!, userData!, message);
    if (result.code === "success") {
      setMessage("");
      // 更新聊天訊息
    }
  };

  console.log(messageList);

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
                <button type="button" className="p-1" onClick={() => dispatch(clearActiveChatRoom())}>
                  <FontAwesomeIcon icon={faAngleLeft} size="lg" className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
                </button>
                <p className="text-lg w-full text-center text-xl">User Name</p>
              </div>

              {/* 訊息顯示區塊 message panel */}
              <div className="h-[calc(100%-50px)] overflow-y-auto mt-[50px] p-5 flex flex-col-reverse">
                <div className="flex flex-col gap-2">
                  {messageList && (
                    messageList.map((messageData) => (
                      <MessageItem
                        key={messageData.messageId}
                        message={messageData.message}
                        createdAt={messageData.createdAt}
                        isOwner={messageData.isOwner}
                      />
                    ))
                  )}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                      e.preventDefault(); // 防止預設的換行行為
                      handleSendMessage();
                    }
                  }}
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
