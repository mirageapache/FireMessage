import { chatListInfoType, chatRoomInfoType } from '@/types/chatType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定義 State 型別
interface ChatState {
  chatData: chatListInfoType | null;
  activeChatRoom: chatListInfoType | null;
  chatRoomInfo: chatRoomInfoType | null;
}

// 初始狀態
const initialState: ChatState = {
  chatData: null,
  activeChatRoom: null, // 開啟的聊天室ID
  chatRoomInfo: null, // 聊天室資訊
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 設定聊天室資料
    setChatData: (state, action: PayloadAction<chatListInfoType | null>) => {
      state.chatData = action.payload;
    },
    // 清除聊天室資料
    clearChatData: (state) => {
      state.chatData = null;
    },
    // 設定開啟的聊天室資訊
    setActiveChatRoom: (
      state,
      action: PayloadAction<{ chatRoom: chatListInfoType }>,
    ) => {
      state.activeChatRoom = action.payload.chatRoom;
    },
    // 清除開啟的聊天室資訊
    clearActiveChatRoom: (state) => {
      state.activeChatRoom = null;
    },
  },
});

export const {
  setChatData,
  clearChatData,
  setActiveChatRoom,
  clearActiveChatRoom,
} = chatSlice.actions;
export default chatSlice.reducer;
