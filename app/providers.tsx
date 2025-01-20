"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setLoading } from "@/store/authSlice";
import {
  collection, query, where, getDocs,
} from "firebase/firestore";
import { userDataType } from "@/types/userType";

// 監聽 Firebase 認證狀態
function AuthStateListener({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (auth && currentUser) {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("uid", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userInfo = userDoc.data() as userDataType;

            const userData = {
              id: userInfo.uid,
              uid: userInfo.uid,
              email: userInfo.email,
              userName: userInfo.userName,
              userAccount: userInfo.userAccount,
              avatarUrl: userInfo.avatarUrl || '',
              bgColor: userInfo.bgColor || '',
              biography: userInfo.biography || '',
              createdAt: userInfo.createdAt.toDate().toISOString(),
              loginType: userInfo.loginType,
              userType: userInfo.userType,
              emailVerified: currentUser.emailVerified,
            };

            dispatch(setUser(userData));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    // 取消訂閱
    return () => unsubscribe();
  }, [dispatch]);

  return children;
}

// Providers 元件
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthStateListener>{children}</AuthStateListener>
      </PersistGate>
    </Provider>
  );
}
