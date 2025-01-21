import { userDataType } from '@/types/userType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定義 State 型別
interface UserState {
  userData: userDataType | null;
  loading: boolean;
}

// 初始狀態
const initialState: UserState = {
  userData: null,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 設定使用者
    setUser: (state, action: PayloadAction<userDataType | null>) => {
      state.userData = action.payload;
      state.loading = false;
    },
    // 清除使用者（登出）
    clearUser: (state) => {
      state.userData = null;
      state.loading = false;
    },
    // 設定載入狀態
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
