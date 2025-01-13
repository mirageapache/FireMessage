import ChatList from "@/components/ChatList";
import React from "react";

function Dashboard() {
  return (
    <div className="flex w-full h-full">
      <aside className="hidden md:block w-full md:max-w-60 lg:max-w-80 bg-gray-700 rounded-lg p-5">
        <ChatList />
      </aside>
      <section className="block w-full border border-red-500 bg-gray-200">main Dashboard</section>
    </div>
  );
}

export default Dashboard;
