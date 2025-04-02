import { chatRoomInfoType } from '@/types/chatType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定義 State 型別
interface ChatState {
  activeChatRoom: chatRoomInfoType | null;
  chatList: chatRoomInfoType[] | null;
}

// 初始狀態
const initialState: ChatState = {
  activeChatRoom: null, // 開啟的聊天室ID
  chatList: null, // 聊天室列表
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 設定開啟的聊天室資訊
    setActiveChatRoom: (
      state,
      action: PayloadAction<{ chatRoom: chatRoomInfoType }>,
    ) => {
      state.activeChatRoom = action.payload.chatRoom;
    },
    // 清除開啟的聊天室資訊
    clearActiveChatRoom: (state) => {
      state.activeChatRoom = null;
    },
    // 設定聊天室列表
    setChatList: (state, action: PayloadAction<chatRoomInfoType[] | null>) => {
      state.chatList = action.payload;
    },
  },
});

export const {
  setActiveChatRoom,
  clearActiveChatRoom,
  setChatList,
} = chatSlice.actions;
export default chatSlice.reducer;
