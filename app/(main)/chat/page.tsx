"use client";

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import ChatRoom from '@/components/ChatRoom';
import ChatList from '@/components/ChatList';

function Chat() {
  const activeChatRoomId = useAppSelector((state) => state.chat.activeChatRoomId);

  return (
    <div className="flex w-full h-full md:pt-5 md:px-5">
      <aside className="hidden md:block w-full md:max-w-60 lg:max-w-80 bg-[var(--card-bg-color)] md:rounded-tl-lg p-5">
        <ChatList />
      </aside>
      <section className="hidden md:block w-full h-full border-l border-[var(--divider-color)] bg-[var(--card-bg-color)] md:rounded-tr-lg">
        <ChatRoom />
      </section>

      {/* 手機版 */}
      {activeChatRoomId === "" ? (
        <div className="md:hidden w-full h-full bg-white dark:bg-[var(--background)] border-b border-[var(--divider-color)] pt-2 px-5">
          <ChatList />
        </div>
      ) : (
        <div className="md:hidden w-full h-full bg-white dark:bg-[var(--background)] border-b border-[var(--divider-color)]">
          <ChatRoom />
        </div>
      )}
    </div>
  );
}

export default Chat;
