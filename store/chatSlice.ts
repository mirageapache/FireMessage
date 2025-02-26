import { chatDataType, chatRoomInfoType } from '@/types/chatType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定義 State 型別
interface ChatState {
  chatData: chatDataType | null;
  activeChatRoomId: string;
  chatRoomInfo: chatRoomInfoType | null;
}

// 初始狀態
const initialState: ChatState = {
  chatData: null,
  activeChatRoomId: "", // 開啟的聊天室ID
  chatRoomInfo: null, // 聊天室資訊
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 設定聊天室資料
    setChatData: (state, action: PayloadAction<chatDataType | null>) => {
      state.chatData = action.payload;
    },
    // 清除聊天室資料
    clearChatData: (state) => {
      state.chatData = null;
    },
    // 設定開啟的聊天室ID
    setActiveChatRoomId: (state, action: PayloadAction<string>) => {
      state.activeChatRoomId = action.payload;
    },
  },
});

export const { setChatData, clearChatData, setActiveChatRoomId } = chatSlice.actions;
export default chatSlice.reducer;
