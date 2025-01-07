import ChatList from '@/components/ChatList';
import React from 'react';

function Dashboard() {
  return (
    <section className="flex w-screen h-full sm:px-5">
      <ChatList />
      <div className="w-full">Chat Room</div>
    </section>
  );
}

export default Dashboard;
