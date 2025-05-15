"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getUserSettings, updateUserSettings } from "@/lib/user";
import {
  setDarkMode,
  setLanguage,
  setSetting,
  setTemplate,
  setToastifyPosition,
} from "@/store/sysSlice";
import { userSettingsType } from "@/types/userType";
import { toast } from "react-toastify";

function UserSetting() {
  const dispatch = useAppDispatch();
  const uid = useAppSelector((state) => state.user.userData?.uid);
  const listItemStyle = "flex justify-between items-center";
  const selectStyle = "bg-[var(--card-bg-color)] w-40 p-1 rounded-lg";
  const [userSetting, setUserSetting] = useState<userSettingsType>({
    darkMode: localStorage.getItem("darkMode") || "",
    language: localStorage.getItem("language") || "",
    toastifyPosition: localStorage.getItem("toastifyPosition") || "",
    template: localStorage.getItem("template") || "",
  });

  /** 取得設定 */
  const getSetting = async () => {
    const res = await getUserSettings(uid!) as userSettingsType;
    setUserSetting(res);
  };

  /** 更新設定 */
  const handleUpdateSetting = async (item: string, value: string) => {
    let darkMode = userSetting?.darkMode;
    let language = userSetting?.language;
    let toastifyPosition = userSetting?.toastifyPosition;
    let template = userSetting?.template;

    switch (item) {
      case "darkMode":
        dispatch(setDarkMode());
        darkMode = value === "dark" ? "" : "dark";
        break;
      case "language":
        dispatch(setLanguage(value));
        language = value;
        break;
      case "toastifyPosition":
        dispatch(setToastifyPosition(value));
        toastifyPosition = value;
        break;
      case "template":
        dispatch(setTemplate(value));
        template = value;
        break;
      default:
        break;
    }

    const newSetting = {
      darkMode: darkMode!,
      language: language!,
      toastifyPosition: toastifyPosition!,
      template: template!,
    };

    dispatch(setSetting(newSetting));
    setUserSetting(newSetting);
    await updateUserSettings(uid!, newSetting);
  };

  useEffect(() => {
    if (uid) getSetting();
  }, [uid]);

  return (
    <div>
      {/* 設定 */}
      <section className="flex flex-col gap-4 my-4 pb-4 px-4 border-b border-[var(--divider-color)]">
        <h4 className="my-1 text-center">設定</h4>
        <div className={cn(listItemStyle)}>
          <p>深色模式</p>
          <button
            aria-label="深色模式切換"
            type="button"
            className="w-14 h-7 flex justify-start items-center border border-gray-400 rounded-full px-2 bg-[var(--background)]"
            onClick={() => handleUpdateSetting("darkMode", userSetting?.darkMode || "")}
          >
            <FontAwesomeIcon
              icon={faSun}
              size="lg"
              className="h-5 w-5 text-orange-500 translate-x-0 opacity-100 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-0"
            />
            <FontAwesomeIcon
              icon={faMoon}
              size="lg"
              className="absolute h-5 w-5 text-yellow-600 translate-x-0 opacity-0 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-100"
            />
          </button>
        </div>
        <div className={cn(listItemStyle)}>
          <p>語言</p>
          <select
            className={selectStyle}
            value={userSetting?.language}
            onChange={(e) => handleUpdateSetting("language", e.target.value)}
          >
            <option value="zh-TW">繁體中文</option>
            {/* <option value="en-US">English</option> */}
          </select>
        </div>
        <div className={cn(listItemStyle)}>
          <p>
            聊天室訊息列表位置
            <br className="sm:hidden" />
            <i className="text-xs text-[var(--secondary-text-color)]">*此效果僅呈現於「768px」以上螢幕</i>
          </p>
          <select
            className={selectStyle}
            value={userSetting?.template}
            onChange={(e) => handleUpdateSetting("template", e.target.value)}
          >
            <option value="left">左側</option>
            <option value="right">右側</option>
          </select>
        </div>
        <div className={cn(listItemStyle)}>
          <p>
            提示訊息位置
            <br className="sm:hidden" />
            <i className="text-xs text-[var(--secondary-text-color)]">*此效果僅呈現於「768px」以上螢幕</i>
          </p>
          <select
            className={selectStyle}
            value={userSetting?.toastifyPosition}
            onChange={(e) => handleUpdateSetting("toastifyPosition", e.target.value)}
          >
            <option value="top-center">中間上方</option>
            <option value="bottom-center">中間下方</option>
            <option value="top-right">右上方</option>
            <option value="bottom-right">右下方</option>
            <option value="top-left">左上方</option>
            <option value="bottom-left">左下方</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="w-40 p-1 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
            onClick={() => toast.success("測試訊息")}
          >
            測試提示訊息
          </button>
        </div>
      </section>
    </div>
  );
}

export default UserSetting;
