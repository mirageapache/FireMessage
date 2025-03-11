import { friendDataType } from "@/types/friendType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 定義 State 型別
interface FriendState {
  friendList: friendDataType[] | null;
  loading: boolean;
}

// 初始狀態
const initialState: FriendState = {
  friendList: [],
  loading: true,
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    // 設定好友列表
    setFriendList: (state, action: PayloadAction<friendDataType[]>) => {
      state.friendList = action.payload;
      state.loading = false;
    },
  },
});

export const { setFriendList } = friendSlice.actions;
export default friendSlice.reducer;
