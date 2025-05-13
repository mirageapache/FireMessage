"use client";

/* eslint-disable consistent-return */
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
import { faAngleDown, faAngleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { cn, detectInputMethod } from '@/lib/utils';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearActiveChatRoom, setActiveChatRoom } from '@/store/chatSlice';
import { getMessages, sendMessage } from '@/lib/chat';
import { messageDataType } from '@/types/chatType';
import { Textarea } from './ui/textarea';
import MessageItem from './MessageItem';
import Spinner from './Spinner';

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
  const [isBottom, setIsBottom] = useState(true); // 判斷訊息區塊是否在最底部
  const [panelHeight, setPanelHeight] = useState<string>("0"); // 訊息區塊高度
  const [isLoading, setIsLoading] = useState(false); // 判斷是否正在載入更多訊息
  const loadingRef = useRef(false); // 使用 ref 來追蹤實時狀態
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

  /** 載入更多訊息 */
  const loadMoreMessages = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const result = await getMessages(
        roomInfo!.chatRoomId,
        userData!.uid!,
        roomInfo!.lastIndexTime,
        10,
      );
      if (result.code === "SUCCESS") {
        setMessageList((prev) => [...(result.messageData as messageDataType[]), ...prev]);
        dispatch(setActiveChatRoom({
          chatRoom: {
            ...roomInfo!,
            lastIndexTime: result.lastIndexTime,
            hasMore: result.hasMore!,
          },
        }));
      }
    } finally {
      // 為了不要連續call api，所以setTimeout delay
      setTimeout(() => {
        setIsLoading(false);
        loadingRef.current = false;
      }, 1000);
    }
  };

  /** 捲動事件檢查 */
  const handleScroll = () => {
    const { scrollTop, scrollHeight, offsetHeight } = panelRef.current!;
    if (scrollTop >= 0) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
      if (scrollTop < 0 && (Math.abs(scrollTop) + 100) >= scrollHeight - offsetHeight) {
        if (roomInfo?.hasMore && !loadingRef.current) {
          loadMoreMessages();
        }
      }
    }
  };

  useEffect(() => {
    handleUpdateReadStatus(false);
  }, [messageList]);

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => { // 監聽訊息顯示區塊高度變動
      const entry = entries[0];
      const { height } = entry.contentRect;
      if (height > 0) {
        setPanelHeight(Math.ceil(height + 20).toString());
      }
    };

    // 建立 ResizeObserver
    const resizeObserver = new ResizeObserver(handleResize);

    const panel = panelRef.current;
    if (panel) {
      handleScroll(); // 初始檢查
      panel.addEventListener("scroll", handleScroll);
      resizeObserver.observe(panel); // 開始觀察元素大小變化

      return () => {
        panel.removeEventListener("scroll", handleScroll);
        resizeObserver.disconnect(); // 停止觀察
      };
    }
  }, [messageList]);

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
            className="p-1 z-10"
            onClick={() => {
              dispatch(clearActiveChatRoom());
              if (currentPath === "chatRoom") router.back();
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} size="lg" className="w-6 h-6 text-[var(--secondary-text-color)] hover:text-[var(--active)]" />
          </button>
          <p className="text-lg w-full text-center translate-x-[-20px] text-xl">{roomInfo.chatRoomName}</p>
        </div>
        <PanelGroup direction="vertical">
          <Panel defaultSize={screenWidth < 640 ? 75 : 85} minSize={60}>
            {/* 訊息顯示區塊 message panel */}
            <button
              type="button"
              style={{ top: `${panelHeight}px` }}
              className={cn(
                `absolute right-[calc(50%+10px)] translate-x-[50%] z-10`,
                "bg-[var(--brand-color)] text-white p-2 rounded-full shadow-lg hover:bg-[var(--active)] transition-colors transition-opacity duration-500",
                isBottom ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto",
              )}
              onClick={() => {
                if (!isBottom) scrollToBottom();
              }}
            >
              <FontAwesomeIcon icon={faAngleDown} size="lg" className="w-6 h-6 text-white" />
            </button>

            <div ref={panelRef} className="relative h-full md:h-[calc(100%-50px)] overflow-y-auto md:mt-[50px] p-5 flex flex-col-reverse">
              <div className="flex flex-col gap-2">
                {isLoading && (
                  <span className="text-[var(--secondary-text-color)] text-md">
                    <Spinner text="載入訊息中..." />
                  </span>
                )}
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
