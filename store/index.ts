import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 引入 Reducers
import authReducer from './authSlice';

// Persist 配置
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // 只持久化 auth reducer
};

// 合併 Reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// 建立持久化 Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 建立 Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

// 建立 Persistor
export const persistor = persistStore(store);

// 定義 RootState 和 AppDispatch 型別
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
