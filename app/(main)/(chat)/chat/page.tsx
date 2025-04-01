"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ChatRoom from '@/components/ChatRoom';
import ChatList from '@/components/ChatList';
import { RootState } from '@/store';
import { getChatList } from '@/lib/chat';
import { chatListInfoType } from '@/types/chatType';
import { useMessage } from '@/hooks/useMessage';
import { setActiveChatRoom, setChatList } from '@/store/chatSlice';
import { setUnReadMessageCount } from '@/store/sysSlice';
import { useChatRoom } from '@/hooks/useChatRoom';
import { cn } from '@/lib/utils';

function Chat() {
  const dispatch = useAppDispatch();
  const activeChatRoomId = useAppSelector((state) => state.chat.activeChatRoom?.chatRoomId);
  const [currentRoomId, setCurrentRoomId] = useState<string | undefined>(activeChatRoomId);
  const uid = useAppSelector((state: RootState) => state.user.userData?.uid);
  const template = useAppSelector((state: RootState) => state.system.userSettings.template);
  const {
    messageList,
    setMessageList,
    handleGetMessage,
    handleGetOrgList,
    handleUpdateReadStatus,
  } = useChatRoom(uid!, currentRoomId!);

  /** 取得聊天室列表資料 */
  const handleGetChatList = async () => {
    if (!uid) return;
    const result = await getChatList(uid!);
    if (result.code === "SUCCESS") {
      dispatch(setChatList(result.chatList as unknown as chatListInfoType[]));
      const count = result.chatList?.reduce((acc, item) => acc + item.unreadCount, 0) || 0;
      dispatch(setUnReadMessageCount(count));
      const currentChatRoomInfo = result.chatList
        ?.find((item) => item.chatRoomId === currentRoomId);
      if (currentChatRoomInfo) {
        dispatch(setActiveChatRoom({ chatRoom: currentChatRoomInfo })); // 更新當前開啟的聊天室資料
      }
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

  useEffect(() => {
    handleGetOrgList();
  }, []);

  // 監聽即時訊息
  useMessage(uid!, "chatroom", currentRoomId || "", handleGetMessage, () => {});

  return (
    <div className={cn("flex w-full h-full md:pt-5 md:px-5", template === "right" ? "flex-row-reverse" : "flex-row")}>
      <aside className={cn(
        "hidden md:block w-full md:max-w-60 lg:max-w-80 bg-[var(--card-bg-color)] p-5",
        template === "right" ? "md:rounded-tr-lg" : "md:rounded-tl-lg",
      )}
      >
        <ChatList
          handleGetChatList={handleGetChatList}
        />
      </aside>
      <section className={cn(
        "hidden md:block w-full h-full border-[var(--divider-color)] bg-[var(--card-bg-color)]",
        template === "right" ? "md:rounded-tl-lg border-r" : "md:rounded-tr-lg border-l",
      )}
      >
        <ChatRoom
          messageList={messageList}
          setMessageList={setMessageList}
          handleUpdateReadStatus={handleUpdateReadStatus}
        />
      </section>

      {/* 手機版 */}
      <div className="md:hidden w-full h-full bg-white dark:bg-[var(--background)] border-b border-[var(--divider-color)] pt-2 px-5">
        <ChatList
          handleGetChatList={handleGetChatList}
        />
      </div>
    </div>
  );
}

export default Chat;
