"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setLoading } from "@/store/userSlice";
import { userDataType, userSettingsType } from "@/types/userType";
import { getUserData, getUserSettings } from "@/lib/user";
import { setInitSetting } from "@/store/sysSlice";
import ThemeProvider from '@/components/ThemeProvider';
import { getFriendList } from "@/lib/friend";
import { friendResponseType } from "@/types/friendType";
import { setFriendList } from "@/store/friendSlice";

// 監聽 Firebase 認證狀態
function AuthStateListener({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await getUserData(currentUser.uid, "") as userDataType;
        dispatch(setUser({
          ...userData,
          emailVerified: currentUser.emailVerified,
        }));
        const userSettings = await getUserSettings(currentUser.uid) as userSettingsType;
        if (userSettings) dispatch(setInitSetting(userSettings));
        const friendList = await getFriendList(currentUser.uid, 5) as friendResponseType;
        if (friendList) dispatch(setFriendList(friendList.data));
      }
      dispatch(setLoading(false));
    });
    return () => unsubscribe(); // [註：這段的功能是當元件卸載時，cleanup function 來停止監聽，避免不必要的資源消耗]
  }, [dispatch]);
  return children;
}

// Providers 元件
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AuthStateListener>{children}</AuthStateListener>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
