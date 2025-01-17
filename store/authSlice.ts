import { userDataType } from '@/types/userType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定義 State 型別
interface AuthState {
  user: userDataType | null;
  loading: boolean;
}

// 初始狀態
const initialState: AuthState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 設定使用者
    setUser: (state, action: PayloadAction<userDataType | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    // 清除使用者（登出）
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
    // 設定載入狀態
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
