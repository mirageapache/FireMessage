import { userSettingsType } from "@/types/userType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SysState {
  userSettings: userSettingsType;
  unCheckedNotiCount: number;
  unReadMessageCount: number;
}

const initialState: SysState = {
  userSettings: {
    darkMode: "",
    toastifyPosition: "top-center",
    template: "default",
    language: "zh-TW",
  },
  unCheckedNotiCount: 0, // 未查看的通知數量
  unReadMessageCount: 0, // 未讀訊息數量
};

const sysSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    // 設定預設設定 [註：從userSettings中取得darkMode、template、language等來設定]
    setSetting: (state, action: PayloadAction<userSettingsType>) => {
      state.userSettings = action.payload;
    },
    // 設定深色模式
    setDarkMode: (state) => {
      let newState = "";
      if (state.userSettings.darkMode === "") newState = "dark";
      state.userSettings.darkMode = newState;
      localStorage.setItem("darkMode", newState);
    },
    // 清除userSettings
    clearUserSettings: (state) => {
      state.userSettings = initialState.userSettings;
    },
    // 設定未查看的通知數量
    setUnCheckedNotiCount: (state, action: PayloadAction<number>) => {
      state.unCheckedNotiCount = action.payload;
    },
    // 設定未讀訊息數量
    setUnReadMessageCount: (state, action: PayloadAction<number>) => {
      state.unReadMessageCount = action.payload;
    },
  },
});

export const {
  setSetting,
  setDarkMode,
  clearUserSettings,
  setUnCheckedNotiCount,
  setUnReadMessageCount,
} = sysSlice.actions;
export default sysSlice.reducer;
