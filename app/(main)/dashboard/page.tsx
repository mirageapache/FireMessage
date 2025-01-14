import React from "react";

function Dashboard() {
  return (
    <div className="flex w-full h-full p-5 md:p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <section className="flex justify-center items-center bg-gray-600 rounded-lg">未讀訊息</section>
        <section className="flex justify-center items-center bg-gray-600 rounded-lg">通知</section>
        <section className="flex justify-center items-center bg-gray-600 rounded-lg">推薦好友</section>
        <section className="flex justify-center items-center bg-gray-600 rounded-lg">item</section>
        <section className="flex justify-center items-center bg-gray-600 rounded-lg">item</section>
      </div>
    </div>
  );
}

export default Dashboard;
