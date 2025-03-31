"use client";

/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import moment from 'moment';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { cn, detectInputMethod } from '@/lib/utils';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearActiveChatRoom } from '@/store/chatSlice';
import { sendMessage } from '@/lib/chat';
import { messageDataType } from '@/types/chatType';
import { Textarea } from './ui/textarea';
import MessageItem from './MessageItem';

function ChatRoom({
  messageList,
  setMessageList,
  handleUpdateReadStatus,
}: {
  messageList: messageDataType[],
  setMessageList: React.Dispatch<React.SetStateAction<messageDataType[]>>,
  handleUpdateReadStatus: (isSendMessage: boolean) => void,
}) {
  const roomInfo = useAppSelector((state: RootState) => state.chat.activeChatRoom);
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const template = useAppSelector((state: RootState) => state.system.userSettings.template);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const screenWidth = window.innerWidth;

  const [message, setMessage] = useState("");
  const [isBottom, setIsBottom] = useState(false); // 判斷訊息區塊是否在最底部
  const dispatch = useAppDispatch();
  const router = useRouter();
  const path = usePathname();
  const currentPath = path?.slice(1);

  /** 捲動至最下方 */
  const scrollToBottom = () => {
    panelRef.current!.scrollTo({
      top: panelRef.current!.scrollHeight,
      behavior: "smooth",
    });
  };

  /** 傳送訊息 */
  const handleSendMessage = async () => {
    if (message.length < 1) return;
    const result = await sendMessage(roomInfo!, userData!, message);
    if (result.code === "SUCCESS") {
      // 建立新訊息物件
      const newMessage: messageDataType = {
        messageId: Date.now().toString(), // 暫時使用時間戳作為ID
        message,
        createdAt: new Date().toISOString(),
        isOwner: true,
        senderData: userData!,
        type: 'text',
      };
      setMessageList((prev) => [...prev, newMessage]);
      textareaRef.current!.value = "";
      setMessage("");
      handleUpdateReadStatus(true);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    }
  };

  useEffect(() => {
    handleUpdateReadStatus(false);
  }, [messageList]);

  useEffect(() => {
    if (panelRef.current) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = panelRef.current!;
        // 如果滾動位置 + 可視區域高度 >= 內容總高度 - 20px (添加一些容差值)
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
        setIsBottom(isAtBottom);
      };
      handleScroll();
      panelRef.current.addEventListener("scroll", handleScroll);
      return () => panelRef.current?.removeEventListener("scroll", handleScroll);
    }
    return () => {};
  }, []);

  if (!roomInfo) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-2xl">開始聊天吧！</p>
      </div>
    );
  }

  return (
    <div
      className="fixed top-0 left-0 md:relative w-full h-svh md:h-full"
      onClick={() => handleUpdateReadStatus(false)}
    >
      <div className="relative h-full">
        {/* 頁首區塊 header */}
        <div className={cn(
          "md:absolute md:top-0 md:left-0 flex justify-start items-center w-full h-[50px] border-b border-[var(--divider-color)] px-2 bg-[var(--card-bg-color)] z-20",
          template === "left" ? "md:rounded-tr-lg" : "md:rounded-tl-lg",
        )}
        >
          <button
            type="button"
            className="p-1"
            onClick={() => {
              dispatch(clearActiveChatRoom());
              if (currentPath === "chatRoom") router.back();
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} size="lg" className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
          </button>
          <p className="text-lg w-full text-center text-xl">{roomInfo.chatRoomName}</p>
        </div>
        <PanelGroup direction="vertical">
          <Panel defaultSize={screenWidth < 640 ? 75 : 85} minSize={60}>
            {/* 訊息顯示區塊 message panel */}
            <div ref={panelRef} className="relative h-full md:h-[calc(100%-50px)] overflow-y-auto md:mt-[50px] p-5 flex flex-col-reverse">
              {!isBottom && (
                <button
                  type="button"
                  onClick={scrollToBottom}
                  className="fixed bottom-5 right-5 bg-[var(--brand-color)] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[var(--active)] transition-colors"
                >
                  移動至底部
                </button>
              )}
              <div className="flex flex-col gap-2">
                {messageList && (
                  messageList.map((messageData, index) => {
                    const currentDate = new Date();
                    let isSameDay = false;
                    if (index > 0) {
                      isSameDay = moment(messageData.createdAt).isSame(moment(messageList[index - 1].createdAt), 'day');
                    }
                    const isSameYear = moment(currentDate).isSame(moment(messageData.createdAt), 'year');
                    const isToday = moment(currentDate).isSame(moment(messageData.createdAt), 'day');

                    // 系統訊息
                    if (messageData.type === "system_message") {
                      return (
                        <div key={messageData.messageId} className="flex justify-center items-center w-full">
                          <p className="text-sm bg-gray-200 text-center text-[var(--disable-text-color)] my-2 py-1 px-3 rounded-md max-w-[70%] whitespace-pre-wrap">
                            {isSameYear ? moment(messageData.createdAt).format("MM/DD HH:mm") : moment(messageData.createdAt).format("YYYY/MM/DD HH:mm")}
                            <br />
                            {messageData.message}
                          </p>
                        </div>
                      );
                    }

                    // 一般訊息
                    return (
                      <div key={messageData.messageId}>
                        {!isSameDay && (
                          <div className="flex justify-center items-center w-full">
                            <p className="text-sm bg-gray-200 text-[var(--disable-text-color)] my-2 py-1 px-3 rounded-md">
                              {isToday ? "今天" : (isSameYear ? moment(messageData.createdAt).format("MM/DD(ddd)") : moment(messageData.createdAt).format("YYYY/MM/DD(ddd)"))}
                            </p>
                          </div>
                        )}
                        <MessageItem
                          messageId={messageData.messageId}
                          message={messageData.message}
                          createdAt={messageData.createdAt}
                          isOwner={messageData.isOwner}
                          senderData={messageData.senderData}
                          type={messageData.type}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle />

          {/* 訊息輸入區塊 input panel */}
          <Panel defaultSize={screenWidth < 640 ? 25 : 15} minSize={15}>
            <div className="flex justify-between items-start w-full h-full border-t border-[var(--divider-color)]">
              <Textarea
                ref={textareaRef}
                className="resize-none w-full h-full text-lg placeholder-gray-400 border-none"
                maxLength={500}
                placeholder="輸入訊息..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                    if (detectInputMethod()) { // 判斷是否為觸控輸入
                      e.preventDefault(); // 觸控輸入 => 換行
                    } else {
                      handleSendMessage();
                    }
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
    </div>
  );
}

export default ChatRoom;
