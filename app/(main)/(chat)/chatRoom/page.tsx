"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import ChatRoom from '@/components/ChatRoom';
import { RootState } from '@/store';
import { useMessage } from '@/hooks/useMessage';
import { useRouter } from 'next/navigation';
import { useChatRoom } from '@/hooks/useChatRoom';

function MobileChatRoom() { // 手機版聊天室頁面(為符合手機操作)
  const router = useRouter();
  const activeChatRoomId = useAppSelector((state) => state.chat.activeChatRoom?.chatRoomId);
  const [currentRoomId, setCurrentRoomId] = useState<string | undefined>(activeChatRoomId);
  const uid = useAppSelector((state: RootState) => state.user.userData?.uid);
  const {
    messageList,
    setMessageList,
    handleGetMessage,
    handleGetOrgList,
    handleUpdateReadStatus,
  } = useChatRoom(uid!, currentRoomId!);

  useEffect(() => {
    if (!activeChatRoomId || activeChatRoomId === "") {
      router.push("/chat");
    }
  }, [activeChatRoomId, router]);

  useEffect(() => {
    const handleResize = () => window.innerWidth > 768 && router.push("/chat"); // 視窗寬度大於768px時，跳轉至聊天室頁面;
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

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
    <div className="flex w-full h-full md:pt-5 md:px-5">
      <div className="md:hidden w-full h-full bg-white dark:bg-[var(--background)] border-b border-[var(--divider-color)]">
        <ChatRoom
          messageList={messageList}
          setMessageList={setMessageList}
          handleUpdateReadStatus={handleUpdateReadStatus}
        />
      </div>
    </div>
  );
}

export default MobileChatRoom;
