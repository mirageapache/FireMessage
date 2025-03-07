"use client";

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import ChatRoom from '@/components/ChatRoom';
import ChatList from '@/components/ChatList';
import { useMessage } from '@/hooks/useMessage';
import { RootState } from '@/store';
import { getMessages } from '@/lib/chat';
import { messageDataType } from '@/types/chatType';

function Chat() {
  const activeChatRoomId = useAppSelector((state) => state.chat.activeChatRoom?.chatRoomId);
  const [isLoading, setIsLoading] = useState(false);
  const [messageList, setMessageList] = useState<messageDataType[]>([]);
  const uid = useAppSelector((state: RootState) => state.user.userData?.uid);

  /** 取得聊天室訊息資料 */
  const handleGetMessage = async (roomId: string) => {
    setIsLoading(true);
    if (!activeChatRoomId) {
      setIsLoading(false);
      return;
    }
    const result = await getMessages(roomId, uid!);
    // console.log(result);
    if (result.code === "success") {
      setMessageList(result.messageData as messageDataType[]);
    }
    setIsLoading(false);
  };

  // 監聽即時訊息
  useMessage(uid!, handleGetMessage);

  useEffect(() => {
    handleGetMessage(activeChatRoomId!);
  }, [activeChatRoomId]);

  return (
    <div className="flex w-full h-full md:pt-5 md:px-5">
      <aside className="hidden md:block w-full md:max-w-60 lg:max-w-80 bg-[var(--card-bg-color)] md:rounded-tl-lg p-5">
        <ChatList />
      </aside>
      <section className="hidden md:block w-full h-full border-l border-[var(--divider-color)] bg-[var(--card-bg-color)] md:rounded-tr-lg">
        <ChatRoom
          isLoading={isLoading}
          messageList={messageList}
          setMessageList={setMessageList}
        />
      </section>

      {/* 手機版 */}
      {activeChatRoomId === "" ? (
        <div className="md:hidden w-full h-full bg-white dark:bg-[var(--background)] border-b border-[var(--divider-color)] pt-2 px-5">
          <ChatList />
        </div>
      ) : (
        <div className="md:hidden w-full h-full bg-white dark:bg-[var(--background)] border-b border-[var(--divider-color)]">
          <ChatRoom
            isLoading={isLoading}
            messageList={messageList}
            setMessageList={setMessageList}
          />
        </div>
      )}
    </div>
  );
}

export default Chat;
