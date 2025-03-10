"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import ChatRoom from '@/components/ChatRoom';
import ChatList from '@/components/ChatList';
import { RootState } from '@/store';
import { getMessages, updateReadStatus } from '@/lib/chat';
import { messageDataType } from '@/types/chatType';
import { useMessage } from '@/hooks/useMessage';

function Chat() {
  const activeChatRoomId = useAppSelector((state) => state.chat.activeChatRoom?.chatRoomId);
  const [currentRoomId, setCurrentRoomId] = useState<string | undefined>(activeChatRoomId);
  const [messageList, setMessageList] = useState<messageDataType[]>([]);
  const uid = useAppSelector((state: RootState) => state.user.userData?.uid);

  /** 取得聊天室訊息資料 */
  const handleGetMessage = async (roomId: string, activeRoomId: string) => {
    if (!activeRoomId || activeRoomId !== roomId) {
      return;
    }
    const result = await getMessages(roomId, uid!);
    if (result.code === "success") {
      setMessageList(result.messageData as messageDataType[]);
    }
  };

  /** 更新讀取狀態 */
  const handleUpdateReadStatus = async () => {
    if (!currentRoomId || !uid) return;
    await updateReadStatus(currentRoomId, uid);
  };

  useEffect(() => {
    if (activeChatRoomId) {
      setCurrentRoomId(activeChatRoomId);
      setMessageList([]);
      handleGetMessage(activeChatRoomId!, currentRoomId!);
      handleUpdateReadStatus();
    }
  }, [activeChatRoomId, currentRoomId]);

  // 監聽即時訊息
  useMessage(uid!, "chatroom", currentRoomId || "", handleGetMessage, () => {});

  return (
    <div className="flex w-full h-full md:pt-5 md:px-5">
      <aside className="hidden md:block w-full md:max-w-60 lg:max-w-80 bg-[var(--card-bg-color)] md:rounded-tl-lg p-5">
        <ChatList />
      </aside>
      <section className="hidden md:block w-full h-full border-l border-[var(--divider-color)] bg-[var(--card-bg-color)] md:rounded-tr-lg">
        <ChatRoom
          messageList={messageList}
          setMessageList={setMessageList}
          handleUpdateReadStatus={handleUpdateReadStatus}
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
            messageList={messageList}
            setMessageList={setMessageList}
            handleUpdateReadStatus={handleUpdateReadStatus}
          />
        </div>
      )}
    </div>
  );
}

export default Chat;
