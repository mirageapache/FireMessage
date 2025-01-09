import ChatList from "@/components/ChatList";
import React from "react";

function Dashboard() {
  return (
    <div className="flex w-full h-full">
      <aside className="w-full md:max-w-80 bg-gray-700 rounded-lg p-5">
        <ChatList />
      </aside>
      <aside className="w-full">Chat Room</aside>
    </div>
  );
}

export default Dashboard;
