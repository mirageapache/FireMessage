import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import React from "react";

function Dashboard() {
  const sectionStyle = "flex justify-center items-center h-auto py-4 px-6 bg-gray-600 rounded-lg";

  return (
    <div className="flex w-full h-full p-5 md:p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <section className={cn(sectionStyle, "flex flex-col")}>
          <div className="flex justify-between items-center w-full border-b border-gray-200 mb-2 pb-2">
            <span>
              <h3>James</h3>
              <p className="pl-1">james_w11</p>
            </span>
            <span>
              <Avatar
                avatarUrl={''}
                userName='James'
                size="w-14 h-14"
                textSize="text-2xl"
                bgColor="#3b82f6"
              />
            </span>
          </div>
          <div className="w-full">
            <p>Hi, I'm James</p>
            <p>‍💻 Frontend Engineer from TW</p>
            <p>📨 工作邀約請連繫：james11@test.com.tw</p>
          </div>

        </section>
        <section className={sectionStyle}>未讀訊息</section>
        <section className={sectionStyle}>通知</section>
        <section className={sectionStyle}>推薦好友</section>
        <section className={sectionStyle}>item</section>
        <section className={sectionStyle}>item</section>
      </div>
    </div>
  );
}

export default Dashboard;
