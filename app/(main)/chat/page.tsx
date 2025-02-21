"use client";

import React from 'react';
import ChatRoom from '@/components/ChatRoom';
import ChatList from '@/components/ChatList';

function Chat() {
  return (
    <div className="flex w-full h-full md:pt-5 md:px-5">
      <aside className="hidden md:block w-full md:max-w-60 lg:max-w-80 bg-[var(--card-bg-color)] md:rounded-tl-lg p-5">
        <ChatList />
      </aside>
      <section className="block w-full h-full border-l border-[var(--divider-color)] bg-[var(--card-bg-color)] md:rounded-tr-lg">
        <ChatRoom />
      </section>
    </div>
  );
}

export default Chat;
