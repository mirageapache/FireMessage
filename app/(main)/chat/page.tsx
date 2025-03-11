"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ChatRoom from '@/components/ChatRoom';
import ChatList from '@/components/ChatList';
import { RootState } from '@/store';
import { getChatList, getMessages, updateReadStatus } from '@/lib/chat';
import { chatListInfoType, messageDataType } from '@/types/chatType';
import { useMessage } from '@/hooks/useMessage';
import { setChatList } from '@/store/chatSlice';
import { setUnReadMessageCount } from '@/store/sysSlice';

function Chat() {
  const dispatch = useAppDispatch();
  const activeChatRoomId = useAppSelector((state) => state.chat.activeChatRoom?.chatRoomId);
  const [currentRoomId, setCurrentRoomId] = useState<string | undefined>(activeChatRoomId);
  const [messageList, setMessageList] = useState<messageDataType[]>([]);
  const uid = useAppSelector((state: RootState) => state.user.userData?.uid);
  const chatList = useAppSelector((state: RootState) => state.chat.chatList);

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

  /** 取得聊天室列表資料 */
  const handleGetChatList = async () => {
    if (!uid) return;
    const result = await getChatList(uid!);
    if (result.code === "success") {
      dispatch(setChatList(result.chatList as unknown as chatListInfoType[]));
      const count = result.chatList?.reduce((acc, item) => acc + item.unreadCount, 0) || 0;
      dispatch(setUnReadMessageCount(count));
    }
  };

  /** 更新讀取狀態 */
  const handleUpdateReadStatus = async (isSendMessage: boolean = false) => {
    if (!currentRoomId || !uid || !chatList) return;
    const currentRoom = chatList.find((item) => {
      if (item.chatRoomId === currentRoomId) {
        return item.unreadCount;
      }
      return 0;
    });
    if ((currentRoom && currentRoom.unreadCount > 0) || isSendMessage) {
      await updateReadStatus(currentRoomId, uid);
      handleGetChatList();
    }
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
        <ChatList
          handleGetChatList={handleGetChatList}
        />
      </aside>
      <section className="hidden md:block w-full h-full border-l border-[var(--divider-color)] bg-[var(--card-bg-color)] md:rounded-tr-lg">
        <ChatRoom
          messageList={messageList}
          setMessageList={setMessageList}
          handleUpdateReadStatus={handleUpdateReadStatus}
        />
      </section>

      {/* 手機版 */}
      {(!activeChatRoomId || activeChatRoomId === "") ? (
        <div className="md:hidden w-full h-full bg-white dark:bg-[var(--background)] border-b border-[var(--divider-color)] pt-2 px-5">
          <ChatList
            handleGetChatList={handleGetChatList}
          />
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
