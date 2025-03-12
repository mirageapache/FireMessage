import { organizationDataType } from "@/types/organizationType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 定義 State 型別
interface OrganizationState {
  organizationList: organizationDataType[] | null;
  loading: boolean;
}

// 初始狀態
const initialState: OrganizationState = {
  organizationList: [],
  loading: true,
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    // 設定群組列表
    setOrganizationList: (state, action: PayloadAction<organizationDataType[]>) => {
      state.organizationList = action.payload;
      state.loading = false;
    },
  },
});

export const { setOrganizationList } = organizationSlice.actions;
export default organizationSlice.reducer;
