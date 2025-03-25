"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { getUserSettings } from "@/lib/user";

function UserSetting() {
  const uid = useAppSelector((state) => state.user.userData?.uid);
  const listItemStyle = "flex justify-between items-center";
  const selectStyle = "bg-[var(--card-bg-color)] w-40 p-1 rounded-lg";
  const [language, setLanguage] = useState<string>("");
  const [toastifyPosition, setToastifyPosition] = useState<string>("");
  const [themeMode, setThemeMode] = useState<string>("");
  const [darkMode, setDarkMode] = useState<string>("");

  const getSetting = async () => {
    const res = await getUserSettings(uid!);
    if (res.code === "SUCCESS") {
      setDarkMode(res.data.darkMode);
      setLanguage(res.data.language);
      setToastifyPosition(res.data.toastifyPosition);
      setThemeMode(res.data.themeMode);
    }
  };

  useEffect(() => {
    if (uid) getSetting();
  }, []);

  return (
    <div>
      {/* 設定 */}
      <section className="flex flex-col gap-4 mb-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <h5 className="sm:text-left">設定</h5>
        <div className={cn(listItemStyle)}>
          <p>好友管理</p>
          <p>開啟</p>
        </div>
        <div className={cn(listItemStyle)}>
          <p>深色模式</p>
          <select
            className={selectStyle}
            value={darkMode}
            onChange={(e) => setDarkMode(e.target.value)}
          >
            <option value="dark">深色</option>
            <option value="">淺色</option>
          </select>
        </div>
        <div className={cn(listItemStyle)}>
          <p>語言</p>
          <select
            className={selectStyle}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="zh-TW">繁體中文</option>
            <option value="en-US">英文</option>
          </select>
        </div>
        <div className={cn(listItemStyle)}>
          <p>提示訊息位置</p>
          <select
            className={selectStyle}
            value={toastifyPosition}
            onChange={(e) => setToastifyPosition(e.target.value)}
          >
            <option value="top-center">中間上方</option>
            <option value="bottom-center">中間下方</option>
            <option value="top-right">右上角</option>
            <option value="bottom-right">右下角</option>
            <option value="top-left">左上角</option>
            <option value="bottom-left">左下角</option>
          </select>
        </div>
        <div className={cn(listItemStyle)}>
          <p>版面</p>
          <select
            className={selectStyle}
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value)}
          >
            <option value="default">預設</option>
          </select>
        </div>
      </section>
    </div>
  );
}

export default UserSetting;
