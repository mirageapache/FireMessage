import { userSettingsType } from "@/types/userType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SysState {
  userSettings: userSettingsType;
  unCheckedNotiCount: number;
}

const initialState: SysState = {
  userSettings: {
    darkMode: "",
    toastifyPosition: "top-center",
    themeMode: "default",
    language: "zh-TW",
  },
  unCheckedNotiCount: 0, // 未查看的通知數量
};

const sysSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    // 設定預設設定 [註：從userSettings中取得darkMode、themeMode、language等來設定]
    setInitSetting: (state, action: PayloadAction<userSettingsType>) => {
      state.userSettings = action.payload;
    },
    // 設定深色模式
    setDarkMode: (state) => {
      let newState = "";
      if (state.userSettings.darkMode === "") newState = "dark";
      state.userSettings.darkMode = newState;
      localStorage.setItem("darkMode", newState);
    },
    // 設定toastify位置
    setToastifyPosition: (state, action: PayloadAction<string>) => {
      state.userSettings.toastifyPosition = action.payload;
    },
    // 設定主題模式
    setThemeMode: (state, action: PayloadAction<string>) => {
      state.userSettings.themeMode = action.payload;
    },
    // 設定語言
    setLanguage: (state, action: PayloadAction<string>) => {
      state.userSettings.language = action.payload;
    },
    // 清除userSettings
    clearUserSettings: (state) => {
      state.userSettings = initialState.userSettings;
    },
    // 設定未查看的通知數量
    setUnCheckedNotiCount: (state, action: PayloadAction<number>) => {
      state.unCheckedNotiCount = action.payload;
    },
  },
});

export const {
  setInitSetting,
  setDarkMode,
  setToastifyPosition,
  setThemeMode,
  setLanguage,
  clearUserSettings,
  setUnCheckedNotiCount,
} = sysSlice.actions;
export default sysSlice.reducer;
