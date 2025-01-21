import { userSettingsType } from "@/types/userType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SysState {
  userSettings: userSettingsType;
}

const initialState: SysState = {
  userSettings: {
    darkMode: "dark",
    toastifyPosition: "top-center",
    themeMode: "default",
    language: "zh-TW",
  },
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
  },
});

export const {
  setInitSetting,
  setDarkMode,
  setToastifyPosition,
  setThemeMode,
  setLanguage,
} = sysSlice.actions;
export default sysSlice.reducer;
